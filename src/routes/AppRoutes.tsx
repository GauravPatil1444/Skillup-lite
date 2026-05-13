import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Courses from '../pages/Courses';
import Dashboard from '../pages/Dashboard';
import LearnLayout from '../pages/LearnLayout';
import Overview from '../pages/tabs/Overview';
import Lessons from '../pages/tabs/Lessons';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/courses" element={<Courses />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/my-courses" element={<Dashboard />} />
        
        <Route path="/learn/:id" element={<LearnLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="lessons" element={<Lessons />} />
          <Route path="resources" element={<div>Resources</div>} />
        </Route>
      </Route>
      
      <Route path="/" element={<Navigate to="/courses" replace />} />
    </Routes>
  );
};

export default AppRoutes;