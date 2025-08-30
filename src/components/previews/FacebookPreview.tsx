"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FacebookPreviewProps {
  imageUrl: string;
}

export default function FacebookPreview({ imageUrl }: FacebookPreviewProps) {
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "facebook-profile-picture.jpg";
    link.click();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Facebook</span>
          <Button size="icon" variant="ghost" onClick={downloadImage}>
            <Download className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Facebook profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-sm">Your Name</p>
              <p className="text-xs text-gray-500">Just now · Public</p>
            </div>
          </div>
          <p className="mt-3 text-sm">Check out my new profile picture!</p>
        </div>
        <div className="mt-4 bg-white border rounded-lg p-4 flex justify-center">
          <div className="w-fit h-fit relative">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Facebook profile large"
              className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-white"
            />
            <div className="absolute bottom-2 right-2 bg-blue-500 rounded-full p-3.5 border-4 border-background" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
