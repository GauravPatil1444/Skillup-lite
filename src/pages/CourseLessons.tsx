import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CourseLessons = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { coursevideolist } = useOutletContext<{ coursevideolist: any[] }>();

  // PATCH /enrollments/:id logic
  const progressMutation = useMutation({
    mutationFn: async (video: any) => {
      const res = await fetch(`http://127.0.0.1:8000/enrollments/mock_id`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'In Progress', lastVideo: video.videoID })
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-enrollments'] })
  });

  return (
    <div className="space-y-5 pb-10">
      {coursevideolist.map((video, index) => (
        <div 
          key={video.videoID}
          onClick={() => {
            progressMutation.mutate(video);
            navigate('/video-preview', { state: { item: video } });
          }}
          className="flex items-center gap-6 bg-white p-5 rounded-3xl border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#192A56] text-white flex items-center justify-center font-bold">{index + 1}</div>
          <div className="flex-1">
            <h4 className="font-bold text-[#192A56] group-hover:text-[#7D96FF] transition-colors">{video.title}</h4>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Not Started</span>
          </div>
          <div className="text-[#7D96FF] text-xl">▶</div>
        </div>
      ))}
    </div>
  );
};

export default CourseLessons;