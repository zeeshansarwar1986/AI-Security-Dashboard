import uvicorn
import shutil
import os
import cv2
import numpy as np
import logging
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("CCTV-Backend")

FACEREC_AVAILABLE = True
try:
    import face_recognition
except ImportError:
    logger.warning("face_recognition library not found. Running in MOCK DETECTION mode.")
    FACEREC_AVAILABLE = False

from sqlmodel import Session, select
from database import create_db_and_tables, get_session
from models import User, Camera, Person, FaceLog, Alert
from auth import get_current_user, get_password_hash, create_access_token, verify_password, ACCESS_TOKEN_EXPIRE_MINUTES

app = FastAPI(title="CCTV Face Detection API - Enterprise")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories
FACES_DIR = "faces"
EVIDENCE_DIR = "evidence"
os.makedirs(FACES_DIR, exist_ok=True)
os.makedirs(EVIDENCE_DIR, exist_ok=True)
app.mount("/faces", StaticFiles(directory=FACES_DIR), name="faces")
app.mount("/evidence", StaticFiles(directory=EVIDENCE_DIR), name="evidence")

# --- In-Memory Cache for Face Encodings ---
class FaceCache:
    def __init__(self):
        self.known_encodings = []
        self.known_ids = []
    
    def reload(self, session: Session):
        if not FACEREC_AVAILABLE:
            logger.info("Face recognition disabled, skipping cache reload.")
            return

        logger.info("Reloading face encoding cache...")
        persons = session.exec(select(Person)).all()
        new_encodings = []
        new_ids = []
        for p in persons:
            try:
                p_path = os.path.join(FACES_DIR, p.image_path)
                if not os.path.exists(p_path):
                    continue
                p_img = face_recognition.load_image_file(p_path)
                encs = face_recognition.face_encodings(p_img)
                if encs:
                    new_encodings.append(encs[0])
                    new_ids.append(p.id)
            except Exception as e:
                logger.error(f"Error loading face for {p.name}: {e}")
        self.known_encodings = new_encodings
        self.known_ids = new_ids
        logger.info(f"Cache reloaded: {len(self.known_ids)} faces indexed.")

face_cache = FaceCache()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    session = next(get_session())
    # Create default admin if not exists
    user = session.exec(select(User).where(User.username == "admin")).first()
    if not user:
        admin = User(username="admin", hashed_password=get_password_hash("admin123"), role="admin")
        session.add(admin)
        session.commit()
        logger.info("Default Admin created: admin/admin123")
    
    # Init Cache
    face_cache.reload(session)

# --- Auth Endpoints ---
@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- Camera Management ---
@app.post("/cameras", response_model=Camera)
def create_camera(camera: Camera, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    session.add(camera)
    session.commit()
    session.refresh(camera)
    return camera

@app.get("/cameras", response_model=List[Camera])
def list_cameras(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    return session.exec(select(Camera)).all()

# --- Person/Face Management ---
@app.post("/persons", response_model=Person)
async def create_person(
    name: str = Form(...),
    category: str = Form(...),
    notes: Optional[str] = Form(None),
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    clean_name = "".join(x for x in name if x.isalnum() or x in " -_")
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{clean_name}_{timestamp}.jpg"
    path = os.path.join(FACES_DIR, filename)
    
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    person = Person(name=name, category=category, notes=notes, image_path=filename)
    session.add(person)
    session.commit()
    session.refresh(person)
    
    # Immediate Cache Refresh
    face_cache.reload(session)
    
    return person

@app.get("/persons", response_model=List[Person])
def list_persons(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    return session.exec(select(Person)).all()

@app.delete("/persons/{person_id}")
def delete_person(person_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    person = session.get(Person, person_id)
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    
    # Remove file if exists
    try:
        os.remove(os.path.join(FACES_DIR, person.image_path))
    except:
        pass
        
    session.delete(person)
    session.commit()
    face_cache.reload(session)
    return {"detail": "Deleted"}

# --- Core Analysis ---
@app.post("/analyze")
async def analyze_image(
    camera_id: Optional[int] = Form(None),
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    
    if FACEREC_AVAILABLE:
        face_locations = face_recognition.face_locations(rgb_img)
        face_encodings = face_recognition.face_encodings(rgb_img, face_locations)
    else:
        # Mock detections for environment without dlib
        # Assume one detection in center if image is provided
        h, w, _ = img.shape
        face_locations = [(h//4, 3*w//4, 3*h//4, w//4)]
        face_encodings = [None]
    
    results = []
    timestamp_str = datetime.now().strftime("%Y%m%d%H%M%S")

    for idx, (top, right, bottom, left) in enumerate(face_locations):
        name = "Unknown"
        category = "Unknown"
        person_id = None
        confidence = 0.0
        
        face_encoding = face_encodings[idx]
        
        if FACEREC_AVAILABLE and face_cache.known_encodings and face_encoding is not None:
            matches = face_recognition.compare_faces(face_cache.known_encodings, face_encoding, tolerance=0.6)
            dists = face_recognition.face_distance(face_cache.known_encodings, face_encoding)
            
            if True in matches:
                best_match_index = np.argmin(dists)
                if matches[best_match_index]:
                    pid = face_cache.known_ids[best_match_index]
                    person = session.get(Person, pid)
                    if person:
                        name = person.name
                        category = person.category
                        person_id = person.id
                        confidence = round(1 - dists[best_match_index], 2)
        elif not FACEREC_AVAILABLE:
            # Randomly match to first person in DB for demo if we have records
            persons = session.exec(select(Person)).all()
            if persons:
                p = persons[0]
                name = p.name
                category = p.category
                person_id = p.id
                confidence = 0.95
            else:
                name = "Demo Identity"
                category = "Visitor"
                confidence = 0.88

        # Save Snapshot Evidence
        evidence_filename = f"ev_{timestamp_str}_{idx}.jpg"
        evidence_path = os.path.join(EVIDENCE_DIR, evidence_filename)
        face_crop = img[top:bottom, left:right]
        if face_crop.size > 0:
            cv2.imwrite(evidence_path, face_crop)
        
        # Log to DB
        log = FaceLog(
            camera_id=camera_id, 
            person_id=person_id, 
            confidence=confidence, 
            image_snapshot_path=evidence_filename
        )
        session.add(log)
        session.commit()
        
        results.append({
            "name": name,
            "category": category,
            "confidence": confidence,
            "box": [top, right, bottom, left],
            "image": evidence_filename
        })

    return {"results": results, "faces_found": len(results)}

# --- Logs & Analytics ---
@app.get("/logs")
def list_logs(limit: int = 20, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(FaceLog).order_by(FaceLog.timestamp.desc()).limit(limit)
    logs = session.exec(statement).all()
    
    results = []
    for log in logs:
        person_name = "Unknown"
        category = "Unknown"
        if log.person_id:
            p = session.get(Person, log.person_id)
            if p:
                person_name = p.name
                category = p.category
        
        results.append({
            "id": log.id,
            "timestamp": log.timestamp.isoformat(),
            "name": person_name,
            "category": category,
            "confidence": f"{int(log.confidence * 100)}%",
            "image": log.image_snapshot_path
        })
    return results

@app.get("/analytics")
def get_analytics(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    total_detections = session.exec(select(FaceLog)).all()
    by_category = {}
    
    for log in total_detections:
        cat = "Unknown"
        if log.person_id:
            p = session.get(Person, log.person_id)
            if p: cat = p.category
        by_category[cat] = by_category.get(cat, 0) + 1
        
    return {
        "total_events": len(total_detections),
        "by_category": by_category
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
