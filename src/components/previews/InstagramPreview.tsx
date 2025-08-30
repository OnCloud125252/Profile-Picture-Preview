"use client";

import { Bookmark, Download, Heart, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InstagramPreviewProps {
  imageUrl: string;
}

export default function InstagramPreview({ imageUrl }: InstagramPreviewProps) {
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "instagram-profile-picture.jpg";
    link.click();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Instagram</span>
          <Button size="icon" variant="ghost" onClick={downloadImage}>
            <Download className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-3">
              {/** biome-ignore lint/performance/noImgElement: using base64 */}
              <img
                src={imageUrl}
                alt="Instagram profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-semibold text-sm">your_username</span>
            </div>
            <Button size="icon" variant="ghost">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Button>
          </div>
          <div className="aspect-square bg-gray-100">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Instagram post"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3">
            <div className="flex justify-between mb-3">
              <div className="flex space-x-4">
                <Heart className="w-6 h-6 cursor-pointer hover:text-red-500" />
                <MessageCircle className="w-6 h-6 cursor-pointer" />
                <Send className="w-6 h-6 cursor-pointer" />
              </div>
              <Bookmark className="w-6 h-6 cursor-pointer" />
            </div>
            <p className="font-semibold text-sm">1,234 likes</p>
            <p className="text-sm mt-1">
              <span className="font-semibold">your_username</span> New profile
              pic!
            </p>
          </div>
        </div>
        <div className="mt-4 text-center">
          {/** biome-ignore lint/performance/noImgElement: using base64 */}
          <img
            src={imageUrl}
            alt="Instagram profile circle"
            className="w-20 h-20 mx-auto rounded-full object-cover border-2 border-pink-500 p-0.5"
          />
          <p className="text-xs mt-2 font-semibold">your_username</p>
        </div>
      </CardContent>
    </Card>
  );
}
