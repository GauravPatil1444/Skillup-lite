import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/services/firebaseConfig";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setUser } from "./store/authSlice";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import CourseView from "./pages/CourseView";
import LearnLayout from "./pages/LearnLayout";
import CourseOverview from "./pages/CourseOverview";
import ProtectedRoute from "./routes/ProtectedRoute";
import CourseLessons from "./pages/CourseLessons";
import Loader from "./components/Loader";
import VideoPreview from "./pages/VideoPreview";

const App = () => {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            role: "student",
            name: firebaseUser.displayName || "",
          }),
        );
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

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
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/courses/:id" element={<CourseView />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/video-preview" element={<VideoPreview />} />
          <Route path="/learn/:id" element={<LearnLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<CourseOverview />} />
            <Route path="lessons" element={<CourseLessons />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/courses" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
