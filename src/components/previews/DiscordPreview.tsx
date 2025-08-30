"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DiscordPreviewProps {
  imageUrl: string;
}

export default function DiscordPreview({ imageUrl }: DiscordPreviewProps) {
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "discord-profile-picture.jpg";
    link.click();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Discord</span>
          <Button size="icon" variant="ghost" onClick={downloadImage}>
            <Download className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-800 rounded-lg p-4 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              {/** biome-ignore lint/performance/noImgElement: using base64 */}
              <img
                src={imageUrl}
                alt="Discord profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Username</span>
                <span className="text-xs bg-blue-500 px-1.5 py-0.5 rounded">
                  BOT
                </span>
              </div>
              <p className="text-xs text-gray-400">Playing a game</p>
            </div>
          </div>
          <div className="bg-gray-900 rounded p-3">
            <p className="text-sm text-gray-400">Today at 12:34 PM</p>
            <p className="text-sm mt-1">Just updated my profile picture!</p>
          </div>
        </div>
        <div className="mt-4 bg-gray-700 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">USER PROFILE</p>
          <div className="flex items-center space-x-4">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Discord profile large"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="text-white">
              <h3 className="font-bold">Username</h3>
              <p className="text-sm text-gray-400">#1234</p>
              <div className="flex items-center mt-2 space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Online</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
