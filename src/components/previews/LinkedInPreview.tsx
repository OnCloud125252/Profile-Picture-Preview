"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LinkedInPreviewProps {
  imageUrl: string;
}

export default function LinkedInPreview({ imageUrl }: LinkedInPreviewProps) {
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "linkedin-profile-picture.jpg";
    link.click();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">LinkedIn</span>
          <Button size="icon" variant="ghost" onClick={downloadImage}>
            <Download className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white border rounded-lg overflow-hidden">
          <div className="bg-gradient-to-b from-blue-600 to-blue-700 h-24"></div>
          <div className="px-4 pb-4 -mt-12">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="LinkedIn profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
            />
            <h3 className="mt-3 text-xl font-semibold">Your Name</h3>
            <p className="text-gray-600">Professional Title</p>
            <p className="text-sm text-gray-500 mt-1">
              Company Name · Location
            </p>
            <p className="text-sm text-blue-600 mt-2">500+ connections</p>
            <div className="flex space-x-2 mt-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm">
                Connect
              </Button>
              <Button variant="outline" className="px-4 py-1 text-sm">
                Message
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-gray-50 rounded p-3">
          <p className="text-sm font-semibold mb-2">Recent Activity</p>
          <div className="flex items-start space-x-2">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="LinkedIn activity"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-xs">
              <p>
                <span className="font-semibold">Your Name</span> updated their
                profile photo
              </p>
              <p className="text-gray-500">2 hours ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
