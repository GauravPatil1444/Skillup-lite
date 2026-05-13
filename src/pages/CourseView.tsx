import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query'; //
import { useAppSelector } from '../store/hooks';
import Loader from './components/Loader';

interface CourseViewProps {
  selectedCourse: any;
  coursevideolist: any[];
  onBack: () => void;
  loader: boolean;
}

const CourseView: React.FC<CourseViewProps> = ({ selectedCourse, coursevideolist, onBack, loader }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.auth);

  // React Query Mutation to handle POST /enrollments
  const enrollMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const response = await fetch('http://127.0.0.1:8000/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId: selectedCourse.playlistId,
          title: selectedCourse.title,
          thumbnails: selectedCourse.thumbnails,
          status: 'Not Started',
          progress: 0
        }),
      });

      if (!response.ok) throw new Error('Enrollment failed');
      return response.json();
    },
    onSuccess: () => {
      // Refresh the "My Courses" cache so the new course appears immediately
      queryClient.invalidateQueries({ queryKey: ['my-enrollments', user?.id] });
      
      // Navigate the user to the learning interface
      navigate(`/learn/${selectedCourse.playlistId}/overview`);
    },
    onError: (error) => {
      alert("Enrollment Error: " + error.message);
    }
  });

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    enrollMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#192A56]">
      {/* Course Header */}
      <div className="flex flex-col items-center pt-16 pb-24 px-6 gap-4 text-center max-w-4xl mx-auto">
        <h1 className="text-[#FBFCF8] text-4xl font-black tracking-tight leading-tight">
          {selectedCourse?.title}
        </h1>
        <p className="text-[#7D96FF] text-xl font-bold">By {selectedCourse?.channelTitle}</p>
        
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
              enrollMutation.isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#7D96FF] hover:scale-105 active:scale-95'
            }`}
          >
            {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
          </button>
        </div>
      </div>

      {/* Lesson List */}
      <div className="bg-[#FBFCF8] rounded-t-[60px] min-h-[60vh] p-8 md:p-12 shadow-2xl relative">
        <div className="max-w-7xl mx-auto">
          {loader ? (
            <div className="flex justify-center py-20"><Loader /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {coursevideolist.map((video) => (
                <div 
                  key={video.videoID} 
                  className="bg-white p-4 rounded-[32px] cursor-pointer hover:shadow-xl transition-all border border-gray-100 group"
                  onClick={() => navigate(`/learn/${selectedCourse.playlistId}/overview`, { state: { item: video } })}
                >
                  <div className="aspect-video rounded-[24px] overflow-hidden mb-5 bg-black relative">
                     <img 
                       src={`https://img.youtube.com/vi/${video.videoID}/mqdefault.jpg`} 
                       alt={video.title} 
                       className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" 
                     />
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-[#7D96FF] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg">▶</div>
                     </div>
                  </div>
                  <h3 className="font-extrabold text-[#192A56] text-lg leading-tight line-clamp-2">
                    {video.title}
                  </h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseView;