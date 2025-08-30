"use client";

import { Download, Link2, Mail, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GitHubPreviewProps {
  imageUrl: string;
}

export default function GitHubPreview({ imageUrl }: GitHubPreviewProps) {
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "github-profile-picture.jpg";
    link.click();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">GitHub</span>
          <Button size="icon" variant="ghost" onClick={downloadImage}>
            <Download className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 border rounded-lg p-4">
          <div className="flex space-x-4">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="GitHub profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold">Your Name</h3>
              <p className="text-gray-600">username</p>
              <p className="text-sm mt-2">Your bio goes here</p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>123 followers · 45 following</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </div>
            <div className="flex items-center space-x-1">
              <Link2 className="w-4 h-4" />
              <span>website.com</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="w-4 h-4" />
              <span>email@example.com</span>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-green-50 border border-green-200 rounded p-2 text-center">
            <p className="text-xs text-gray-600">Contributions</p>
            <p className="text-lg font-bold">1,234</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
            <p className="text-xs text-gray-600">Repositories</p>
            <p className="text-lg font-bold">42</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
