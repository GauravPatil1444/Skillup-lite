import React, { useState, useEffect } from 'react';
import { useParams, Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import logo from '../assets/Logo.png';

const LearnLayout = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const [selectedCourse, setSelectedCourse] = useState(location.state?.selectedCourse || null);
  const [coursevideolist, setCoursevideolist] = useState(location.state?.videos || []);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      
      try {
        const enrollRes = await fetch(`http://127.0.0.1:8000/enrollments?userId=${user.id}`);
        const enrollments = await enrollRes.json();
        const currentEnrollment = enrollments.find((e: any) => e.courseId === id);

        if (currentEnrollment) {
          setEnrollmentId(currentEnrollment.id);

          if (!selectedCourse) {
            setSelectedCourse({
              ...currentEnrollment,
              channelTitle: currentEnrollment.channelTitle || "Expert Instructor"
            });
          }
        }

        const videoRes = await fetch('http://127.0.0.1:8000/fetchcoursevideos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: id })
        });
        const videoData = await videoRes.json();
        const cleanVideos = videoData.filter((v: any) => v && v.videoID);
        setCoursevideolist(cleanVideos);

      } catch (e) {
        console.error("LearnLayout fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user?.id]);

  return (
    <div className="min-h-screen bg-[#192A56]">
      <div className="absolute top-8 inset-x-0 px-6 flex justify-between md:justify-end md:gap-4 z-20">
        <button
          onClick={() => navigate("/courses")}
          className="px-5 py-2 rounded-xl bg-[#A5BEFC]/10 border border-white/20 text-[#FBFCF8] text-sm font-bold hover:bg-[#A5BEFC]/30 backdrop-blur-md transition-all"
        >
          Catalog
        </button>
        <button
          onClick={() => navigate("/my-courses")}
          className="px-5 py-2 rounded-xl bg-[#A5BEFC]/10 border border-white/20 text-[#FBFCF8] text-sm font-bold hover:bg-[#A5BEFC]/30 backdrop-blur-md transition-all"
        >
          Dashboard
        </button>
      </div>

      <div className="flex flex-col items-center pt-16 pb-14 px-4 text-center">
        <img src={logo} alt="Skillup" className="w-24 h-auto mb-6 animate-pulse" />
        <h1 className="text-[#FBFCF8] text-2xl font-black tracking-tight">
          {selectedCourse?.title || "Learning Hub"}
        </h1>
      </div>

      <div className="bg-[#FBFCF8] rounded-t-[60px] min-h-[70vh] p-8 md:p-12 shadow-2xl relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex border-b border-gray-200 mb-10 overflow-x-auto scrollbar-hide">
            {['overview', 'lessons'].map((tab) => (
              <NavLink 
                key={tab}
                to={`/learn/${id}/${tab}`}
                state={{ selectedCourse, videos: coursevideolist }}
                className={({ isActive }) => 
                  `px-10 py-4 font-bold text-lg capitalize transition-all border-b-4 whitespace-nowrap ${
                    isActive ? 'border-[#7D96FF] text-[#192A56]' : 'border-transparent text-gray-400 hover:text-[#192A56]/60'
                  }`
                }
              >
                {tab}
              </NavLink>
            ))}
          </div>

          <Outlet context={{ selectedCourse, coursevideolist, loading, enrollmentId }} />
        </div>
      </div>
    </div>
  );
};

export default LearnLayout;