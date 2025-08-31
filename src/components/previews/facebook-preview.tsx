"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FacebookPreviewProps {
  imageUrl: string;
}

export default function FacebookPreview({ imageUrl }: FacebookPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Facebook</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="rounded-lg p-4"
          style={{ backgroundColor: isDark ? "#242526" : "#F0F2F5" }}
        >
          <div className="flex items-center space-x-3">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Facebook profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p
                className="font-semibold text-sm"
                style={{ color: isDark ? "#E4E6EB" : "#050505" }}
              >
                Your Name
              </p>
              <p
                className="text-xs"
                style={{ color: isDark ? "#B0B3B8" : "#65676B" }}
              >
                Just now · Public
              </p>
            </div>
          </div>
          <p
            className="mt-3 text-sm"
            style={{ color: isDark ? "#E4E6EB" : "#050505" }}
          >
            Check out my new profile picture!
          </p>
        </div>
        <div
          className="mt-4 border rounded-lg p-4 flex justify-center"
          style={{
            backgroundColor: isDark ? "#18191A" : "#FFFFFF",
            borderColor: isDark ? "#3E4042" : "#DADDE1",
          }}
        >
          <div className="w-fit h-fit relative">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Facebook profile large"
              className="w-40 h-40 mx-auto rounded-full object-cover border-4"
              style={{ borderColor: isDark ? "#18191A" : "#FFFFFF" }}
            />
            <div
              className="absolute bottom-2 right-2 rounded-full p-3.5 border-4"
              style={{
                backgroundColor: "#1877F2",
                borderColor: isDark ? "#18191A" : "#FFFFFF",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
