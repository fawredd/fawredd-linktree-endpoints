'use client'

import { Share } from "lucide-react";
import { Button } from "./ui/button";

export default function ShareButton ({ profileName }: { profileName: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileName}'s content`,
          text: `Check ${profileName} content!`,
          url: window.location.href,
        });
        console.log("Content shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      alert("Web Share API not supported in this browser.");
    }
  };
  return (
    <Button
      variant="secondary"
      size="sm"
      className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white/95 rounded-full p-2"
      onClick={handleShare}
    >
      <Share className="w-4 h-4" />
    </Button>
  );
};
