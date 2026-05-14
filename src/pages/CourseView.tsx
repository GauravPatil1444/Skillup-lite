import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../store/hooks";
import Loader from "../components/Loader";
import CourseCard from "../components/CourseCard";

interface CourseViewProps {
  selectedCourse: any;
  coursevideolist: any[];
  onBack: () => void;
  loader: boolean;
}

const CourseView: React.FC<CourseViewProps> = ({
  selectedCourse,
  coursevideolist,
  onBack,
  loader,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  // --- PAGINATION STATE ---
  const [page, setPage] = useState(1);
  const limit = 8;

  // Calculate slicing indices
  const startIndex = (page - 1) * limit;
  const paginatedVideos = coursevideolist.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(coursevideolist.length / limit);

  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const response = await fetch("http://127.0.0.1:8000/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          courseId: selectedCourse.playlistId,
          title: selectedCourse.title,
          thumbnails: selectedCourse.thumbnails,
          channelTitle: selectedCourse.channelTitle, // Include this
          status: "Not Started",
          progress: 0,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-enrollments", user?.id] });
      navigate(`/learn/${selectedCourse.playlistId}/overview`);
    },
  });

  const handleEnroll = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    enrollMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#192A56]">
      {/* Course Header */}
      <div className="flex flex-col items-center pt-16 pb-10 px-6 gap-4 text-center max-w-4xl mx-auto">
        <h1 className="text-[#FBFCF8] text-4xl font-black tracking-tight leading-tight">
          {selectedCourse?.title}
        </h1>
        <p className="text-[#7D96FF] text-xl font-bold">
          By {selectedCourse?.channelTitle}
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onBack}
            className="px-8 py-2 rounded-xl bg-[#A5BEFC]/20 border border-[#FBFCF8] text-[#FBFCF8] font-bold hover:bg-[#A5BEFC]/30 transition-all"
          >
            Go Back
          </button>
          <button
            onClick={handleEnroll}
            disabled={enrollMutation.isPending}
            className={`px-8 py-2 rounded-xl text-white font-bold shadow-lg transition-all ${
              enrollMutation.isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#7D96FF] hover:scale-105 active:scale-95"
            }`}
          >
            {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
          </button>
        </div>
      </div>

      {/* Lesson List with Pagination */}
      <div className="bg-[#FBFCF8] rounded-t-[60px] min-h-[60vh] p-8 md:p-12 shadow-2xl relative">
        <div className="max-w-7xl mx-auto">
          {/* HEADER PAGINATION */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <h2 className="text-[#192A56] text-3xl font-black">
              Course Curriculum
            </h2>

            <div className="flex items-center gap-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-[#192A56] font-bold disabled:opacity-20 text-[#192A56] hover:bg-[#192A56] hover:text-white transition-all"
              >
                ←
              </button>

              <div className="flex items-center gap-2">
                {Array.from(
                  { length: Math.min(totalPages, 3) },
                  (_, i) => i + 1,
                ).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-10 h-10 rounded-xl font-black transition-all ${
                      page === n
                        ? "bg-[#192A56] text-white shadow-md"
                        : "text-[#192A56] hover:bg-[#192A56]/5 border-2 border-transparent"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-[#192A56] font-bold disabled:opacity-20 text-[#192A56] hover:bg-[#192A56] hover:text-white transition-all"
              >
                →
              </button>
            </div>
          </div>

          {loader ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {paginatedVideos.map((video: any) => (
                <CourseCard
                  key={video.videoID}
                  course={video}
                  variant="lesson"
                  onClick={() =>
                    navigate(`/learn/${selectedCourse.playlistId}/overview`, {
                      state: { item: video },
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseView;
