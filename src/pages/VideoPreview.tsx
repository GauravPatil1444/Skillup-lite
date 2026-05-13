import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/authSlice';
import logo from '../assets/Logo.png';

const VideoPreview = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  
  // Extract course data passed from the catalog
  const { item } = location.state || {};

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#192A56] font-sans relative">
      {/* Absolute Positioned Actions */}
      <div className="absolute top-8 right-8 flex gap-4 z-10">
        <button 
          onClick={() => navigate('/courses')}
          className="px-5 py-2 rounded-lg bg-[#A5BEFC]/20 border border-[#FBFCF8] text-[#FBFCF8] text-sm font-bold hover:bg-[#A5BEFC]/40 transition-all"
        >
          Back to Catalog
        </button>
        <button 
          onClick={handleLogout}
          className="px-5 py-2 rounded-lg bg-red-500/20 border border-red-400 text-red-100 text-sm font-bold hover:bg-red-500/40 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Header Section */}
      <div className="flex flex-col items-center pt-16 pb-28 px-4 gap-4 text-center">
        <img src={logo} alt="Skillup Logo" className="w-28 h-auto mb-2" />
        {user && (
          <h1 className="text-[#FBFCF8] text-2xl font-black tracking-tight">
            Learning: <span className="text-[#7D96FF]">{item?.title || "New Course"}</span>
          </h1>
        )}
      </div>

      {/* Main Content Area (Rounded Overlay) */}
      <div className="bg-[#FBFCF8] rounded-t-[60px] min-h-[70vh] px-6 md:px-16 py-16 shadow-2xl">
        <div className="max-w-5xl mx-auto">
          {/* Immersive Video Player Section */}
          <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-8">
            {item?.videoID ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${item.videoID}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-white/50 font-bold">
                Video Loading...
              </div>
            )}
          </div>

          {/* Course Details */}
          <div className="space-y-4 px-2">
            <h2 className="text-3xl font-black text-[#192A56] tracking-tight leading-tight">
              {item?.title}
            </h2>
            <p className="text-[#192A56]/60 font-bold text-lg">
              Presented by {item?.channelTitle || "SkillUp Expert"}
            </p>
            
            <div className="pt-6 border-t border-gray-200">
               <p className="text-gray-600 leading-relaxed text-lg">
                 Start your journey into {item?.title}. This course is designed to take you from foundational concepts to advanced practical applications.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;