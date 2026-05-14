import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import logo from "../assets/Logo.png";
import Loader from "../components/Loader";
import { useQuery } from "@tanstack/react-query";
import logoutIcon from "../assets/exit.png";
import CourseCard from "../components/CourseCard";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";

const MyCourses = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const {
    data: enrolledCourses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-enrollments", user?.id],
    queryFn: async () => {
      const res = await fetch(
        `http://127.0.0.1:8000/enrollments?userId=${user?.id}`,
      );
      if (!res.ok) throw new Error("Failed to fetch enrolled courses");
      return res.json();
    },
    enabled: !!user?.id, 
  });

  const handleLogout = async () => {
  try {
    await signOut(auth); 
    dispatch(logout());  
    navigate("/login", { replace: true }); 
  } catch (error) {
    console.error("Logout failed", error);
  }
};

  return (
    <div className="min-h-screen bg-[#192A56] font-sans relative">
  
      <div className="absolute top-8 inset-x-0 px-6 flex justify-between md:justify-end md:gap-4 z-20">
        <button
          onClick={() => navigate("/courses")}
          className="px-5 py-2 rounded-xl bg-[#A5BEFC]/10 border border-white/20 text-[#FBFCF8] text-sm font-bold hover:bg-[#A5BEFC]/30 backdrop-blur-md transition-all"
        >
          Catalog
        </button>
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-xl bg-red-500/10 border border-red-400/30 text-red-100 text-sm font-bold hover:bg-red-500/30 backdrop-blur-md transition-all"
        >
          <img src={logoutIcon} width={25} alt="Logout" />
        </button>
      </div>

      <div className="flex flex-col items-center pt-14 pb-10 px-4 gap-4 text-center">
        <img
          src={logo}
          alt="Skillup Logo"
          className="w-32 h-auto mb-4 animate-pulse"
        />
        <div className="space-y-2">
          <h1 className="text-[#FBFCF8] text-4xl font-black tracking-tight">
            My <span className="text-[#7D96FF]">Learning</span> Dashboard
          </h1>
          <p className="text-[#FBFCF8]/70 text-lg font-medium">
            Keep track of your progress and continue learning.
          </p>
        </div>
      </div>

      <div className="bg-[#FBFCF8] rounded-t-[60px] min-h-[60vh] px-4 md:px-16 py-10 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-black text-[#192A56] tracking-tight">
              Your Enrolled Courses
            </h2>
            <span className="bg-[#A5BEFC]/20 text-[#192A56] px-4 py-1 rounded-full font-bold text-sm">
              {enrolledCourses?.length || 0} Total
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500 font-bold">
              Error loading courses. Please try again.
            </div>
          ) : enrolledCourses && enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {enrolledCourses.map((course: any) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  variant="dashboard"
                  onClick={() =>
                    navigate(`/learn/${course.courseId}/overview`, {
                      state: { selectedCourse: course },
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <p className="text-[#192A56] text-2xl font-bold opacity-30">
                No courses saved yet.
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="text-[#7D96FF] font-bold hover:underline"
              >
                Browse the catalog to get started
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
