import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import MyCourses from "./pages/MyCourses";
import VideoPreview from "./pages/VideoPreview";
import LearnLayout from "./pages/LearnLayout";
import CourseOverview from "./pages/CourseOverview";
import ProtectedRoute from "./routes/ProtectedRoute";
import CourseLessons from "./pages/CourseLessons";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/courses" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />

        {/* Student Only Routes */}
        <Route element={<ProtectedRoute requiredRole="student" />}>
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/learn/:id" element={<LearnLayout />}>
            <Route path="overview" element={<CourseOverview />} />
            <Route path="lessons" element={<CourseLessons />} />
          </Route>
        </Route>

        {/* Admin Only Routes (Optional) */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin/dashboard" element={<div>Admin Console</div>} />
          <Route
            path="/admin/create-course"
            element={<div>Course Creator</div>}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
