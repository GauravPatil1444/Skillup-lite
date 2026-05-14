import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig"; 
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setUser } from "./store/authSlice";

// Page Imports
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import VideoPreview from "./pages/VideoPreview";
import LearnLayout from "./pages/LearnLayout";
import CourseOverview from "./pages/CourseOverview";
import ProtectedRoute from "./routes/ProtectedRoute";
import CourseLessons from "./pages/CourseLessons";
import Loader from "./pages/components/Loader";

const App = () => {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Listen for authentication state changes on mount
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Restore session data into Redux
        dispatch(setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          role: 'student', // You can fetch the actual role from Firestore here
          name: firebaseUser.displayName || ""
        }));
      } else {
        // Ensure state reflects logged-out status
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Prevent rendering routes while Firebase is checking for an existing session
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#192A56] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/video-preview" element={<VideoPreview />} />

        {/* Student Only Routes */}
        <Route element={<ProtectedRoute requiredRole="student" />}>
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/learn/:id" element={<LearnLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<CourseOverview />} />
            <Route path="lessons" element={<CourseLessons />} />
          </Route>
        </Route>

        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin/dashboard" element={<div>Admin Console</div>} />
          <Route path="/admin/create-course" element={<div>Course Creator</div>} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/courses" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;