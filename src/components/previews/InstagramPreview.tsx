"use client";

import { Bookmark, Download, Heart, MessageCircle, Send } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InstagramPreviewProps {
  imageUrl: string;
}

export default function InstagramPreview({ imageUrl }: InstagramPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        <div className="text-center">
          {/** biome-ignore lint/performance/noImgElement: using base64 */}
          <img
            src={imageUrl}
            alt="Instagram profile circle"
            className="w-20 h-20 mx-auto rounded-full object-cover border-2 p-0.5"
            style={{ borderColor: "#E4405F" }}
          />
          <p
            className="text-xs mt-2 font-semibold"
            style={{ color: isDark ? "#F5F5F5" : "#262626" }}
          >
            your_username
          </p>
        </div>
        <div
          className="mt-4 border rounded-lg"
          style={{
            backgroundColor: isDark ? "#000000" : "#FFFFFF",
            borderColor: isDark ? "#262626" : "#DBDBDB",
          }}
        >
          <div
            className="flex items-center justify-between p-3"
            style={{
              borderBottom: `1px solid ${isDark ? "#262626" : "#DBDBDB"}`,
            }}
          >
            <div className="flex items-center space-x-3">
              {/** biome-ignore lint/performance/noImgElement: using base64 */}
              <img
                src={imageUrl}
                alt="Instagram profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span
                className="font-semibold text-sm"
                style={{ color: isDark ? "#F5F5F5" : "#262626" }}
              >
                your_username
              </span>
            </div>
            <Button size="icon" variant="ghost">
              <svg
                className="w-5 h-5"
                fill={isDark ? "#F5F5F5" : "#262626"}
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Button>
          </div>
          <div
            className="aspect-square"
            style={{ backgroundColor: isDark ? "#000000" : "#FAFAFA" }}
          >
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
                <Heart
                  className="w-6 h-6 cursor-pointer hover:text-[#ED4956]"
                  style={{ color: isDark ? "#F5F5F5" : "#262626" }}
                />
                <MessageCircle
                  className="w-6 h-6 cursor-pointer"
                  style={{ color: isDark ? "#F5F5F5" : "#262626" }}
                />
                <Send
                  className="w-6 h-6 cursor-pointer"
                  style={{ color: isDark ? "#F5F5F5" : "#262626" }}
                />
              </div>
              <Bookmark
                className="w-6 h-6 cursor-pointer"
                style={{ color: isDark ? "#F5F5F5" : "#262626" }}
              />
            </div>
            <p
              className="font-semibold text-sm"
              style={{ color: isDark ? "#F5F5F5" : "#262626" }}
            >
              1,234 likes
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: isDark ? "#F5F5F5" : "#262626" }}
            >
              <span className="font-semibold">your_username</span> New profile
              pic!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
