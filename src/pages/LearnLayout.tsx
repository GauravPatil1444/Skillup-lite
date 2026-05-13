import React, { useState, useEffect } from 'react';
import { useParams, Outlet, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/Logo.png';

const LearnLayout = () => {
  const { id } = useParams(); // Playlist ID from URL
  const location = useLocation();

  // Initialize state from navigation state (passed from Catalog/CourseView)
  const [selectedCourse, setSelectedCourse] = useState(location.state?.courseDetails || null);
  const [coursevideolist, setCoursevideolist] = useState(location.state?.videos || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // If we already have the course and videos from the state, don't fetch again
      if (selectedCourse && coursevideolist.length > 0) return;

      setLoading(true);
      try {
        // Fetching the video list via POST to the gateway
        const videoRes = await fetch('http://127.0.0.1:8000/fetchcoursevideos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: id })
        });

        if (!videoRes.ok) throw new Error("Failed to fetch videos");
        
        const videoData = await videoRes.json();
        
        // Clean the data to remove metadata objects that cause UI "ghost" items
        const cleanVideos = videoData.filter((v: any) => v && v.videoID);
        setCoursevideolist(cleanVideos);

        // DATA SYNC: If selectedCourse is null (usually on page refresh), 
        // we populate it with basic info from the video results so the UI can render.
        if (!selectedCourse) {
          setSelectedCourse({
            playlistId: id,
            title: cleanVideos[0]?.title || "Course Content",
            description: "Detailed overview available in the catalog.",
            channelTitle: "Instructor"
          });
        }
      } catch (e) {
        console.error("LearnLayout fetch error:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, selectedCourse]); // Re-run if ID changes or if course data is still missing

  return (
    <div className="min-h-screen bg-[#192A56]">
      {/* Header Section */}
      <div className="flex flex-col items-center pt-12 pb-24 px-4 text-center">
        <img src={logo} alt="Skillup" className="w-24 h-auto mb-6" />
        <h1 className="text-[#FBFCF8] text-2xl font-black tracking-tight">
          Learning Center
        </h1>
      </div>

      {/* Main Content Card */}
      <div className="bg-[#FBFCF8] rounded-t-[60px] min-h-[70vh] p-8 md:p-12 shadow-2xl relative">
        <div className="max-w-5xl mx-auto">
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 mb-10 overflow-x-auto scrollbar-hide">
            {['overview', 'lessons'].map((tab) => (
              <NavLink 
                key={tab}
                to={`/learn/${id}/${tab}`}
                // Pass the current state through the NavLink so it doesn't get lost when switching tabs
                state={{ courseDetails: selectedCourse, videos: coursevideolist }}
                className={({ isActive }) => 
                  `px-10 py-4 font-bold text-lg capitalize transition-all border-b-4 whitespace-nowrap ${
                    isActive 
                      ? 'border-[#7D96FF] text-[#192A56]' 
                      : 'border-transparent text-gray-400 hover:text-[#192A56]/60'
                  }`
                }
              >
                {tab}
              </NavLink>
            ))}
          </div>

          {/* The Outlet acts as a gateway to CourseOverview and CourseLessons. 
             We pass the data via context so the children can access it instantly.
          */}
          <Outlet context={{ selectedCourse, coursevideolist, loading }} />
        </div>
      </div>
    </div>
  );
};

export default LearnLayout;