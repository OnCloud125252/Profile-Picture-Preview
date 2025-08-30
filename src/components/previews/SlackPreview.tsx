"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SlackPreviewProps {
  imageUrl: string;
}

export default function SlackPreview({ imageUrl }: SlackPreviewProps) {
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "slack-profile-picture.jpg";
    link.click();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Slack</span>
          <Button size="icon" variant="ghost" onClick={downloadImage}>
            <Download className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-start space-x-3 mb-4">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Slack profile"
              className="w-9 h-9 rounded object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm">Your Name</span>
                <span className="text-xs text-gray-500">12:34 PM</span>
              </div>
              <p className="text-sm mt-1">
                Hey team! Just updated my profile picture 📸
              </p>
            </div>
          </div>
          <div className="border-l-4 border-gray-300 pl-3 ml-5">
            <p className="text-xs text-gray-500">Thread</p>
            <div className="flex items-center space-x-2 mt-1">
              {/** biome-ignore lint/performance/noImgElement: using base64 */}
              <img
                src={imageUrl}
                alt="Slack reply"
                className="w-6 h-6 rounded object-cover"
              />
              <p className="text-sm">Looking good! 👍</p>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 mb-2">PROFILE</p>
          <div className="flex items-center space-x-3">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Slack profile large"
              className="w-16 h-16 rounded object-cover"
            />
            <div>
              <h3 className="font-semibold">Your Name</h3>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xs text-gray-500 mt-1">Local time: 12:34 PM</p>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-sm">
              <span className="text-gray-500">Title:</span> Software Developer
            </p>
            <p className="text-sm">
              <span className="text-gray-500">Email:</span> you@example.com
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
