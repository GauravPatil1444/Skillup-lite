import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const CourseOverview = () => {
  const navigate = useNavigate();
  const { selectedCourse } = useOutletContext<{ selectedCourse: any }>();

  if (!selectedCourse) {
    return <p className="text-gray-400 font-bold">Loading course details...</p>;
  }

  // Read last watched video from localStorage using courseId as key
  const storedVideo = localStorage.getItem(`lastVideo_${selectedCourse.courseId}`);
  const lastVideo = storedVideo ? JSON.parse(storedVideo) : null;

  const handleContinue = () => {
    if (lastVideo) {
      navigate(`/learn/${selectedCourse.courseId}/lessons`, {
        state: { autoPlayVideoId: lastVideo.videoID }
      });
    } else {
      navigate(`/learn/${selectedCourse.courseId}/lessons`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fadeIn">
      <div className="lg:col-span-2">
        <h3 className="text-2xl font-black text-[#192A56] mb-4">
          {selectedCourse.title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-lg mb-8">
          {selectedCourse.description}
        </p>

        <h3 className="text-2xl font-black text-[#192A56] mb-4">Instructor</h3>
        <p className="text-[#7D96FF] font-bold text-xl">
          {selectedCourse.channelTitle || "Expert Instructor"}
        </p>
      </div>

      <div className="bg-[#A5BEFC]/10 p-8 rounded-[40px] h-fit border border-[#192A56]/5">
        <h4 className="font-black text-[#192A56] mb-4 text-center">Course Stats</h4>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between font-bold text-sm">
            <span className="text-gray-400 uppercase">Level</span>
            <span className="text-[#192A56]">Intermediate</span>
          </div>
          <div className="flex justify-between font-bold text-sm">
            <span className="text-gray-400 uppercase">Status</span>
            <span className="text-green-500">Enrolled</span>
          </div>
          <div className="flex justify-between font-bold text-sm">
            <span className="text-gray-400 uppercase">Progress</span>
            <span className="text-[#192A56]">{selectedCourse.progress || 0}%</span>
          </div>
        </div>

        {/* Continue Learning / Start Course button */}
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-[#192A56] text-white font-black hover:bg-[#192A56]/90 transition-all shadow-lg active:scale-95"
        >
          {lastVideo ? "Continue Learning" : "Start Course"}
        </button>

        {/* Show last watched video title if resuming */}
        {lastVideo && (
          <p className="text-xs text-gray-400 text-center mt-3 font-medium truncate">
            Last watched: {lastVideo.title}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseOverview;