"use client";

import { Download, Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TwitterPreviewProps {
  imageUrl: string;
}

export default function TwitterPreview({ imageUrl }: TwitterPreviewProps) {
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "twitter-profile-picture.jpg";
    link.click();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">X (Twitter)</span>
          <Button size="icon" variant="ghost" onClick={downloadImage}>
            <Download className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-2xl p-4">
          <div className="flex space-x-3">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Twitter profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <span className="font-bold">Your Name</span>
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-500 text-sm">@username · 1m</span>
              </div>
              <p className="mt-2 text-sm">
                Just updated my profile picture! What do you think?
              </p>
              <div className="flex justify-between mt-4 text-gray-500">
                <MessageCircle className="w-5 h-5 cursor-pointer hover:text-blue-500" />
                <Repeat2 className="w-5 h-5 cursor-pointer hover:text-green-500" />
                <Heart className="w-5 h-5 cursor-pointer hover:text-red-500" />
                <Share className="w-5 h-5 cursor-pointer hover:text-blue-500" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Twitter profile large"
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />
            <div>
              <h3 className="font-bold text-xl">Your Name</h3>
              <p className="text-gray-500">@username</p>
              <p className="text-sm mt-1">Your bio goes here</p>
              <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                <span>
                  <span className="font-bold text-black">123</span> Following
                </span>
                <span>
                  <span className="font-bold text-black">456</span> Followers
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
