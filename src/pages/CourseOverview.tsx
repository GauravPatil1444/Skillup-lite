import React from 'react';
import { useOutletContext } from 'react-router-dom';

const CourseOverview = () => {
  const { selectedCourse } = useOutletContext<{ selectedCourse: any }>();

  if (!selectedCourse) return <p className="text-gray-400 font-bold">Loading course details...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-fadeIn">
      <div className="lg:col-span-2">
        <h3 className="text-2xl font-black text-[#192A56] mb-4">About this course</h3>
        <p className="text-gray-600 leading-relaxed text-lg mb-8">{selectedCourse.description}</p>
        
        <h3 className="text-2xl font-black text-[#192A56] mb-4">Instructor</h3>
        <p className="text-[#7D96FF] font-bold text-xl">{selectedCourse.channelTitle}</p>
      </div>
      
      <div className="bg-[#A5BEFC]/10 p-8 rounded-[40px] h-fit border border-[#192A56]/5">
        <h4 className="font-black text-[#192A56] mb-4 text-center">Course Stats</h4>
        <div className="space-y-4">
          <div className="flex justify-between font-bold text-sm">
            <span className="text-gray-400 uppercase">Level</span>
            <span className="text-[#192A56]">Intermediate</span>
          </div>
          <div className="flex justify-between font-bold text-sm">
            <span className="text-gray-400 uppercase">Status</span>
            <span className="text-green-500">Enrolled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;