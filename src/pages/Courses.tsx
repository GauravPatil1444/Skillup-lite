import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import { useQuery } from "@tanstack/react-query";
import CourseView from "./CourseView";
import logo from "../assets/Logo.png";
import search from "../assets/search.png";
import logoutIcon from "../assets/exit.png";
import CourseCard from "../components/CourseCard";

const topics = [
  "Web development",
  "Machine Learning",
  "Python",
  "Java",
  "Cloud Computing",
];

const Courses = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [searchInp, setSearchInp] = useState(""); 
  const [localInput, setLocalInput] = useState(""); 
  const [viewCourse, setViewCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [coursevideolist, setCoursevideolist] = useState<any[]>([]);
  const [fetchingVideos, setFetchingVideos] = useState(false);

  const limit = 8;

  // --- DATA FETCHING (REACT QUERY) ---
  const {
    data: metadata,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["courses", page, searchInp], // Watches searchInp, not localInput
    queryFn: async () => {
      const query = searchInp || "React";
      const res = await fetch(
        `http://127.0.0.1:8000/fetchcourses?_page=${page}&_limit=${limit}&q=${query}`,
      );

      const rawData = await res.json();
      return rawData.filter(
        (item: any) => item && item.playlistId && item.title,
      );
    },
    placeholderData: (previousData) => previousData,
    enabled: !viewCourse,
    staleTime: 1000 * 60 * 5,
  });

  // --- HANDLERS ---
  const handleSearch = () => {
    setSearchInp(localInput); // Trigger API call
    setPage(1);
  };

  const handleTopicClick = (topic: string) => {
    setLocalInput(topic);
    setSearchInp(topic); // Trigger API call
    setPage(1);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const openCourse = async (item: any) => {
    if (fetchingVideos) return;
    setFetchingVideos(true);
    setSelectedCourse(item);
    setViewCourse(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/fetchcoursevideos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: item.playlistId }),
      });
      const videoData = await res.json();
      setCoursevideolist(videoData);
    } catch (error) {
      console.error("Error loading course preview:", error);
    } finally {
      setFetchingVideos(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // When paging, we scroll to the top of the white modal
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  if (viewCourse) {
    return (
      <CourseView
        selectedCourse={selectedCourse}
        coursevideolist={coursevideolist}
        onBack={() => setViewCourse(false)}
        loader={fetchingVideos}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#192A56] selection:bg-[#7D96FF] selection:text-white">
      {/* 1. FIXED BACKGROUND HERO SECTION */}
      <div className="fixed inset-0 h-[500px] bg-[#192A56] flex flex-col items-center pt-5 px-4 gap-5 z-0">
        {/* TOP NAVIGATION BAR */}
        <div className="absolute top-8 inset-x-0 px-6 flex justify-between md:justify-end md:gap-4 z-20">
          <button
            onClick={() => navigate("/my-courses")}
            className="px-5 py-2 rounded-xl bg-[#A5BEFC]/10 border border-white/20 text-[#FBFCF8] text-sm font-bold hover:bg-[#A5BEFC]/30 backdrop-blur-md transition-all"
          >
            My Courses
          </button>
          <button
            onClick={handleLogout}
            className="px-5 py-2 rounded-xl bg-red-500/10 border border-red-400/30 text-red-100 text-sm font-bold hover:bg-red-500/30 backdrop-blur-md transition-all"
          >
            <img src={logoutIcon} width={25} alt="Logout" />
          </button>
        </div>

        <img
          src={logo}
          alt="Skillup"
          className="w-32 mb-2 mt-8 animate-pulse"
        />
        <p className="text-gray-50 text-2xl font-medium">
          Welcome, {user?.name || "Learner"}
        </p>

        {/* SEARCH BAR WITH EXPLICIT BUTTON */}
        <div className="w-full max-w-xl relative group">
          <input
            type="text"
            placeholder="What do you want to learn today?"
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-6 pr-20 text-white text-lg focus:outline-none focus:ring-2 focus:ring-[#7D96FF]/50 transition-all placeholder:text-white/40"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:bg-white/20 text-white p-3 rounded-xl transition-all shadow-lg active:scale-95"
          >
            <img src={search} width={25} alt="search" />
          </button>
        </div>

        {/* TOPICS */}
        <div className="w-full max-w-4xl flex overflow-x-auto gap-3 pb-4 scrollbar-hide justify-center px-4">
          {topics.map((topic) => (
            <button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${
                searchInp === topic
                  ? "bg-[#7D96FF] border-[#7D96FF] text-white"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SCROLLABLE WHITE MODAL LAYER */}
      <div className="relative z-10 mt-[420px] bg-[#FBFCF8] rounded-t-[60px] min-h-screen p-6 md:p-16 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <div className="max-w-7xl mx-auto">
          {/* HEADER PAGINATION */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h2 className="text-[#192A56] text-3xl font-black">
              Explore Catalog
            </h2>

            <div className="flex items-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-[#192A56] font-bold disabled:opacity-20 text-[#192A56] hover:bg-[#192A56] hover:text-white transition-all shadow-sm"
              >
                ←
              </button>

              <div className="flex items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => handlePageChange(n)}
                    className={`w-10 h-10 rounded-xl font-black transition-all ${
                      page === n
                        ? "bg-[#192A56] text-white shadow-md scale-105"
                        : "text-[#192A56] hover:bg-[#192A56]/5 border-2 border-transparent"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                disabled={
                  isPlaceholderData || (metadata && metadata.length < limit)
                }
                onClick={() => handlePageChange(page + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-[#192A56] font-bold disabled:opacity-20 text-[#192A56] hover:bg-[#192A56] hover:text-white transition-all shadow-sm"
              >
                →
              </button>
            </div>
          </div>

          {/* SKELETON OR GRID SECTION */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video rounded-3xl bg-gray-200 mb-5 shadow-sm"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {metadata?.map((course: any) => (
                <CourseCard
                  key={course.playlistId}
                  course={course}
                  variant="catalog"
                  onClick={() => openCourse(course)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
