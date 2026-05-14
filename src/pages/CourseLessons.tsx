import React, { useEffect } from "react";
import {
  useOutletContext,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import play from "../assets/play.png";

const CourseLessons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { id: courseId } = useParams(); // always reliable, from URL

  const { coursevideolist, enrollmentId } = useOutletContext<{
    coursevideolist: any[];
    enrollmentId: string | null;
  }>();

  // Auto-navigate to last watched video when coming from "Continue Learning"
  const autoPlayVideoId = location.state?.autoPlayVideoId;

  useEffect(() => {
    if (autoPlayVideoId && coursevideolist.length > 0) {
      const video = coursevideolist.find((v) => v.videoID === autoPlayVideoId);
      if (video) {
        navigate("/video-preview", {
          state: { item: { ...video, courseId } },
          replace: true, // replaces the current history entry so back button works correctly
        });
      }
    }
  }, [autoPlayVideoId, coursevideolist]);

  const progressMutation = useMutation({
    mutationFn: async (video: any) => {
      if (!enrollmentId) {
        console.warn("No enrollment ID found. Progress not saved.");
        return;
      }

      const res = await fetch(
        `http://127.0.0.1:8000/enrollments/${enrollmentId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "In Progress", // fixed casing
            lastVideo: video.videoID,
          }),
        },
      );

      if (!res.ok) throw new Error("Failed to update progress");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
    },
  });

  return (
    <div className="space-y-5 pb-10">
      {coursevideolist.map((video, index) => (
        <div
          key={video.videoID}
          onClick={() => {
            progressMutation.mutate(video);
            navigate("/video-preview", {
              state: {
                item: {
                  ...video,
                  courseId, // from useParams, always present
                },
              },
            });
          }}
          className="flex items-center gap-6 bg-white p-5 rounded-3xl border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-[#192A56] text-white flex items-center justify-center font-bold">
            {index + 1}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[#192A56] group-hover:text-[#7D96FF] transition-colors">
              {video.title}
            </h4>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Video {index + 1}
            </span>
          </div>
          <div className="text-[#7D96FF] text-xl"><img src={play} width={25} alt="play" /></div>
        </div>
      ))}
    </div>
  );
};

export default CourseLessons;
