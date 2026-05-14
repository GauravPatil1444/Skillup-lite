import React from 'react';
import play from "../assets/play.png";

interface CourseCardProps {
  course: any;
  onClick: () => void;
  variant?: 'catalog' | 'dashboard' | 'lesson';
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, variant = 'catalog' }) => {
  const isDashboard = variant === 'dashboard';
  const isLesson = variant === 'lesson';

  // Lesson variants use YouTube IDs for thumbnails
  const thumbnailSrc = isLesson 
    ? `https://img.youtube.com/vi/${course.videoID}/mqdefault.jpg` 
    : course.thumbnails;

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer hover:-translate-y-2 transition-all duration-300"
    >
      <div className="relative aspect-video rounded-3xl overflow-hidden mb-5 shadow-xl border border-gray-100 bg-black">
        <img
          src={thumbnailSrc}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
        />
        
        {/* Play overlay for lessons */}
        {isLesson && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-[#7D96FF] w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg">
              <img src={play} width={25} alt="play" />
            </div>
          </div>
        )}

        {/* Status Badge for Dashboard */}
        {isDashboard && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
              course.status === 'Completed' ? 'bg-green-500 text-white' : 
              course.status === 'In Progress' ? 'bg-[#7D96FF] text-white' : 'bg-gray-200 text-gray-700'
            }`}>
              {course.status || 'Not Started'}
            </span>
          </div>
        )}
      </div>

      <h3 className={`font-extrabold text-[#192A56] leading-snug line-clamp-2 group-hover:text-[#7D96FF] transition-colors ${
        isLesson ? 'text-lg' : 'text-xl'
      }`}>
        {course.title}
      </h3>

      {/* Progress Bar for Dashboard */}
      {isDashboard && (
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#7D96FF] transition-all duration-500" 
              style={{ width: `${course.progress || 0}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-gray-400">{course.progress || 0}%</span>
        </div>
      )}
    </div>
  );
};

export default CourseCard;