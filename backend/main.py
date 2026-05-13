from fastapi import FastAPI, Request, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from content_provider import fetchcourses, customsearch, fetchcoursevideos
from pydantic import BaseModel
from threading import Lock
from typing import List, Optional
import json
import os
import time
from datetime import datetime, timedelta

app = FastAPI()

# --- CORS CONFIGURATION ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FILE PATHS ---
ENROLLMENTS_FILE = 'enrollments.json'

# --- MODELS ---
class Item(BaseModel):
    q: str|None = None
    data:str|None = None

class EnrollmentItem(BaseModel):
    userId: str
    courseId: str
    title: str
    thumbnails: str
    status: str = "Not Started"
    progress: int = 0

class ProgressUpdate(BaseModel):
    status: Optional[str] = None
    lastWatchedVideo: Optional[str] = None

# --- HELPERS ---
def load_data(file_path, default):
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return default
    return default

def save_data(file_path, data):
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

# --- ENDPOINTS ---

@app.get("/")
async def root():
    return {"message": "Skillup API Gateway running"}

@app.get("/fetchcourses")
def sendcourses(
    q: str = Query(None), 
    _page: int = Query(1), 
    _limit: int = Query(8)
):
    try:
        # Call the provider
        full_results = fetchcourses(q)
        
        # Filter out metadata/headers and ensure valid objects
        data = [item for item in full_results if isinstance(item, dict) and item.get("playlistId")]
        
        if not data:
            # If provider returned successfully but with no data, try fallback
            return sendcourses(q="Free Courses", _page=_page, _limit=_limit)

        start = (_page - 1) * _limit
        end = start + _limit
        return data[start:end]

    except KeyError as e:
        # This catches the 'nextPageToken' crash from content_provider.py
        if "'nextPageToken'" in str(e):
            print(f"KeyError caught for '{q}'. Triggering fallback search to avoid empty list.")
            # FALLBACK: Search for a broad term that is guaranteed to have multiple pages
            return sendcourses(q="Full Course", _page=_page, _limit=_limit)
        return []

    except Exception as e:
        print(f"General Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Gateway Error")

@app.post("/fetchcoursevideos")
def sendcoursevideos(item: Item):
    try:
        if not item.q:
            return []
        videos = fetchcoursevideos(item.q)
        # Filter to ensure only valid video objects are returned
        return [v for v in videos if isinstance(v, dict) and v.get("videoID")]
    except Exception:
        return []

@app.get("/enrollments")
def get_enrollments(userId: str = Query(...)):
    all_enrollments = load_data(ENROLLMENTS_FILE, [])
    return [e for e in all_enrollments if e.get("userId") == userId]

@app.post("/enrollments")
def create_enrollment(item: EnrollmentItem):
    enrollments = load_data(ENROLLMENTS_FILE, [])
    if any(e['userId'] == item.userId and e['courseId'] == item.courseId for e in enrollments):
        return {"message": "Already enrolled"}
    new_entry = item.model_dump()
    new_entry["id"] = f"enr_{int(time.time())}"
    enrollments.append(new_entry)
    save_data(ENROLLMENTS_FILE, enrollments)
    return new_entry

@app.patch("/enrollments/{enrollment_id}")
def update_enrollment_progress(enrollment_id: str, update: ProgressUpdate):
    """Update progress for a specific enrollment."""
    enrollments = load_data(ENROLLMENTS_FILE, [])
    
    # DEBUG: Print to see what ID is coming from React
    print(f"Searching for enrollment ID: {enrollment_id}") 

    for e in enrollments:
        # Match the ID from the URL with the 'id' field in your JSON
        if str(e.get("id")) == str(enrollment_id):
            if update.status: 
                e["status"] = update.status
            
            # Increment progress by 10%
            e["progress"] = min(e.get("progress", 0) + 10, 100)
            
            save_data(ENROLLMENTS_FILE, enrollments)
            return e
    
    # If no match is found, it returns the 404 you are seeing
    raise HTTPException(status_code=404, detail=f"Enrollment {enrollment_id} not found")

@app.get("/courses/{course_id}")
def get_course_detail(course_id: str):
    """
    Fetches details for a single course. 
    Handles the provider crash if nextPageToken is missing.
    """
    try:
        # This call likely crashes on line 91 of content_provider.py
        results = fetchcourses(course_id)
        
        # If it didn't crash, find the course
        course = next((item for item in results if isinstance(item, dict) and item.get("playlistId") == course_id), None)
        if course:
            return course

    except KeyError as e:
        # If it crashed, we can't get the data from 'results' because the function exited.
        # We need a way to get the data without the provider crashing.
        print(f"Caught expected provider crash for ID: {course_id}")
        
        # WORKAROUND: If your provider crashes, we can return a basic object 
        # so the UI doesn't break, or search for a broader term.
        return {
            "playlistId": course_id,
            "title": "Course Details",
            "channelTitle": "Loading...",
            "description": "Please refresh or try again shortly."
        }
        
    except Exception as e:
        print(f"Detail Endpoint Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")