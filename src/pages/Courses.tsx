import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/authSlice";
import { useQuery } from "@tanstack/react-query";
import Loader from "./components/Loader";
import CourseView from "./CourseView";
import logo from "../assets/Logo.png";

const TOPICS = [
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

  // --- STATE ---
  const [page, setPage] = useState(1);
  const [searchInp, setSearchInp] = useState("");
  const [viewCourse, setViewCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [coursevideolist, setCoursevideolist] = useState<any[]>([]);
  const [fetchingVideos, setFetchingVideos] = useState(false);

  const limit = 8; // Mandatory limit for pagination

  // --- DATA FETCHING (REACT QUERY) ---
  const {
    data: metadata,
    isLoading,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["courses", page, searchInp],
    // Inside Courses.tsx -> useQuery
    queryFn: async () => {
      const query = searchInp || "React";
      const res = await fetch(
        `http://127.0.0.1:8000/fetchcourses?_page=${page}&_limit=${limit}&q=${query}`,
      );
      if (!res.ok) throw new Error("Backend connection failed");

      const rawData = await res.json();

      return rawData.filter(
        (item: any) => item && item.playlistId && item.title,
      );
    },
    placeholderData: (previousData) => previousData,
  });

  // --- HANDLERS ---
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Inside Courses.tsx -> openCourse function
  const openCourse = async (item: any) => {
    setFetchingVideos(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/fetchcoursevideos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: item.playlistId }),
      });
      const videoData = await res.json();

      // Pass the 'item' (course details) through state
      navigate(`/learn/${item.playlistId}/overview`, {
        state: {
          courseDetails: item,
          videos: videoData,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingVideos(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    // Smooth scroll back to the start of the results
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
    <div className="min-h-screen bg-[#192A56] relative selection:bg-[#7D96FF] selection:text-white">
      {/* TOP NAVIGATION BAR */}
      <div className="absolute top-8 right-8 flex gap-4 z-20">
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
          Logout
        </button>
      </div>

      {/* HERO SECTION */}
      <div className="flex flex-col items-center pt-24 pb-32 px-4 gap-8">
        <img
          src={logo}
          alt="Skillup"
          className="w-32 mb-2 mt-8 animate-pulse-slow"
        />

        <p className="text-gray-50 text-2xl">Welcome,{user?.name}</p>

        <div className="w-full max-w-xl relative">
          <input
            type="text"
            placeholder="What do you want to learn today?"
            className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-[#7D96FF]/50 transition-all placeholder:text-white/40"
            value={searchInp}
            onChange={(e) => {
              setSearchInp(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="w-full max-w-2xl flex overflow-x-auto gap-3 pb-4 scrollbar-hide justify-center px-4">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => {
                setSearchInp(topic);
                setPage(1);
              }}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all border ${
                searchInp === topic
                  ? "bg-[#7D96FF] border-[#7D96FF] text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-[#FBFCF8] rounded-t-[60px] min-h-[60vh] p-8 md:p-16 shadow-2xl relative -mt-10">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader />
              <p className="text-[#192A56]/40 font-bold animate-pulse">
                Fetching your courses...
              </p>
            </div>
          ) : (
            <>
              {/* GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {metadata?.map((course: any) => (
                  <div
                    key={course.playlistId}
                    onClick={() => openCourse(course)}
                    className="group cursor-pointer hover:-translate-y-2 transition-all duration-300"
                  >
                    <div className="aspect-video rounded-3xl overflow-hidden mb-5 shadow-xl ring-1 ring-black/5">
                      <img
                        src={course.thumbnails}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="font-extrabold text-[#192A56] text-lg leading-snug line-clamp-2 group-hover:text-[#7D96FF] transition-colors">
                      {course.title}
                    </h3>
                  </div>
                ))}
              </div>

              {/* CONSOLIDATED PAGINATION FOOTER */}
              <div className="flex flex-col items-center mt-24 gap-6">
                <div className="flex items-center gap-6">
                  <button
                    disabled={page === 1}
                    onClick={() => handlePageChange(page - 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-[#192A56] font-bold disabled:opacity-20 text-[#192A56] hover:bg-[#192A56] hover:text-white transition-all shadow-sm"
                  >
                    ←
                  </button>

                  <div className="flex items-center gap-3">
                    {[1, 2, 3].map((n) => (
                      <button
                        key={n}
                        onClick={() => handlePageChange(n)}
                        className={`w-12 h-12 rounded-2xl font-black transition-all ${
                          page === n
                            ? "bg-[#192A56] text-white shadow-xl scale-110"
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
                    className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-[#192A56] font-bold disabled:opacity-20 text-[#192A56] hover:bg-[#192A56] hover:text-white transition-all shadow-sm"
                  >
                    →
                  </button>
                </div>

                <p className="text-xs font-black text-[#192A56]/30 uppercase tracking-[0.2em]">
                  Showing page {page}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
