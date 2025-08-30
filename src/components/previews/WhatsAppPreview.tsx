"use client";

import { Download, Phone, Search, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WhatsAppPreviewProps {
  imageUrl: string;
}

export default function WhatsAppPreview({ imageUrl }: WhatsAppPreviewProps) {
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "whatsapp-profile-picture.jpg";
    link.click();
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">WhatsApp</span>
          <Button size="icon" variant="ghost" onClick={downloadImage}>
            <Download className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <div className="bg-green-600 text-white p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/** biome-ignore lint/performance/noImgElement: using base64 */}
              <img
                src={imageUrl}
                alt="WhatsApp profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">Contact Name</p>
                <p className="text-xs">Online</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Video className="w-5 h-5 cursor-pointer" />
              <Phone className="w-5 h-5 cursor-pointer" />
              <Search className="w-5 h-5 cursor-pointer" />
            </div>
          </div>
          <div className="bg-[#E5DDD5] p-4">
            <div className="bg-white rounded-lg p-3 max-w-[80%] ml-auto mb-2">
              <p className="text-sm">Check out my new profile picture!</p>
              <p className="text-xs text-gray-500 text-right mt-1">12:34 PM</p>
            </div>
            <div className="bg-green-100 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">Looks great! 👍</p>
              <p className="text-xs text-gray-500 text-right mt-1">
                12:35 PM ✓✓
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-white border rounded-lg p-4">
          <p className="text-sm font-semibold mb-3">Contact Info</p>
          <div className="flex items-center space-x-4">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="WhatsApp profile large"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold">Contact Name</h3>
              <p className="text-sm text-gray-600">+1 234 567 8900</p>
              <p className="text-xs text-gray-500 mt-1">
                Hey there! I am using WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
