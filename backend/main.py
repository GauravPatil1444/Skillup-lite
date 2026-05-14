from fastapi import FastAPI, Request, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from content_provider import fetchcourses, customsearch, fetchcoursevideos
from pydantic import BaseModel
from typing import List, Optional
import firebase_admin
from firebase_admin import credentials, firestore
import os
import time

app = FastAPI()

# --- FIREBASE ADMIN SDK SETUP ---
# Path to your serviceAccountKey.json (downloaded from Firebase Console)
if not firebase_admin._apps:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class Item(BaseModel):
    q: str|None = None
    data:str|None = None

class EnrollmentItem(BaseModel):
    userId: str
    courseId: str
    title: str
    thumbnails: str
    channelTitle: str 
    status: str = "Not Started"
    progress: int = 0

class ProgressUpdate(BaseModel):
    status: Optional[str] = None
    lastWatchedVideo: Optional[str] = None

# --- ENDPOINTS ---

@app.get("/")
async def root():
    return {"message": "Skillup API Gateway running with Firestore"}

@app.get("/fetchcourses")
def sendcourses(
    q: str = Query(None), 
    _page: int = Query(1), 
    _limit: int = Query(8)
):
    search_term = q or "React"
    try:
        full_results = fetchcourses(search_term)
    except KeyError:
        print(f"Provider crashed for '{search_term}'. Using safe fallback.")
        try:
            full_results = fetchcourses("Programming")
        except:
            full_results = []

    data = [
        item for item in full_results 
        if isinstance(item, dict) and item.get("playlistId")
    ]
    
    if not data:
        data = [{
            "playlistId": "fixed_id",
            "title": "Welcome to Skillup",
            "thumbnails": "https://via.placeholder.com/150"
        }]

    start = (_page - 1) * _limit
    end = start + _limit
    return data[start:end]

@app.post("/fetchcoursevideos")
def sendcoursevideos(item: Item):
    try:
        if not item.q:
            return []
        videos = fetchcoursevideos(item.q)
        return [v for v in videos if isinstance(v, dict) and v.get("videoID")]
    except Exception:
        return []

# --- FIRESTORE ENROLLMENT ENDPOINTS ---

@app.get("/enrollments")
def get_enrollments(userId: str = Query(...)):
    """Fetch user enrollments directly from Firestore"""
    try:
        enrollments_ref = db.collection("enrollments")
        # Querying the collection based on the userId
        query = enrollments_ref.where("userId", "==", userId).stream()
        
        return [doc.to_dict() | {"id": doc.id} for doc in query]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/enrollments")
def create_enrollment(item: EnrollmentItem):
    """Create a new enrollment document in Firestore"""
    enrollments_ref = db.collection("enrollments")
    
    # Check for existing enrollment to prevent duplicates
    existing = enrollments_ref.where("userId", "==", item.userId).where("courseId", "==", item.courseId).limit(1).get()
    
    if len(existing) > 0:
        return {"message": "Already enrolled"}

    new_entry = item.model_dump()
    # Generate a unique ID for the enrollment record
    new_id = f"enr_{int(time.time())}"
    new_entry["id"] = new_id
    
    # Set the document in the 'enrollments' collection
    enrollments_ref.document(new_id).set(new_entry)
    return new_entry

# Updated main.py
@app.patch("/enrollments/{enrollment_id}")
def update_enrollment_progress(enrollment_id: str, update: ProgressUpdate):
    """Update progress dynamically based on total video count"""
    doc_ref = db.collection("enrollments").document(enrollment_id)
    doc = doc_ref.get()

    if not doc.exists:
        raise HTTPException(status_code=404, detail=f"Enrollment {enrollment_id} not found")

    current_data = doc.to_dict()
    course_id = current_data.get("courseId")
    
    # 1. Fetch total videos for this specific course to get count
    try:
        videos = fetchcoursevideos(course_id)
        total_videos = len([v for v in videos if isinstance(v, dict) and v.get("videoID")])
        # Fallback to 10 if no videos found to avoid division by zero
        total_videos = total_videos if total_videos > 0 else 10 
    except:
        total_videos = 10

    # 2. Calculate the percentage increment per video
    increment = 100 / total_videos
    
    updates = {}
    if update.status: 
        updates["status"] = update.status
    
    # 3. Apply the dynamic increment
    new_progress = min(current_data.get("progress", 0) + increment, 100)
    updates["progress"] = int(new_progress) # Keep it as a whole number
    
    doc_ref.update(updates)
    return {**current_data, **updates}
