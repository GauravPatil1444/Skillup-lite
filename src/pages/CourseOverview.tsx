import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';

const CourseOverview = () => {
  const navigate = useNavigate();
  const { selectedCourse } = useOutletContext<{ selectedCourse: any }>();

  if (!selectedCourse) return <p>Loading...</p>;
  const currentId = selectedCourse.courseId || selectedCourse.playlistId;

  const storedVideo = localStorage.getItem(`lastVideo_${currentId}`);
  const lastVideo = storedVideo ? JSON.parse(storedVideo) : null;

  const handleContinue = () => {
    if (!currentId) return; 

    const targetPath = `/learn/${currentId}/lessons`;
    
    if (lastVideo) {
      navigate(targetPath, { state: { autoPlayVideoId: lastVideo.videoID } });
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <h3 className="text-2xl font-black text-[#192A56] mb-4">{selectedCourse.title}</h3>
        <p className="text-gray-600 text-lg mb-8">{selectedCourse.description}</p>
        <h3 className="text-2xl font-black text-[#192A56] mb-4">Instructor</h3>
        <p className="text-[#7D96FF] font-bold text-xl">{selectedCourse.channelTitle || "Expert Instructor"}</p>
      </div>

      <div className="bg-[#A5BEFC]/10 p-8 rounded-[40px] border border-[#192A56]/5">
        <h4 className="font-black text-[#192A56] mb-6 text-center">Course Stats</h4>
        <div className="space-y-4 mb-8">
           <div className="flex justify-between font-bold text-sm">
            <span className="text-gray-400 uppercase">Progress</span>
            <span className="text-[#192A56]">{selectedCourse.progress || 0}%</span>
          </div>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl bg-[#192A56] text-white font-black hover:bg-[#192A56]/90 shadow-lg active:scale-95 transition-all"
        >
          {lastVideo ? "Continue Learning" : "Start Course"}
        </button>

        {lastVideo && (
          <p className="text-[10px] text-gray-400 text-center mt-3 truncate px-2">
            Resuming: {lastVideo.title}
          </p>
        )}
      </div>
    </div>
  );
};

export default CourseOverview;