"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LinkedInPreviewProps {
  imageUrl: string;
}

export default function LinkedInPreview({ imageUrl }: LinkedInPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">LinkedIn</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border rounded-lg overflow-hidden"
          style={{
            backgroundColor: isDark ? "#1B1F23" : "#FFFFFF",
            borderColor: isDark ? "#38434F" : "#D9D9D9",
          }}
        >
          <div
            className="h-24"
            style={{
              background: "linear-gradient(to bottom, #0A66C2, #004182)",
            }}
          ></div>
          <div className="px-4 pb-4 -mt-12">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="LinkedIn profile"
              className="w-24 h-24 rounded-full object-cover border-4"
              style={{ borderColor: isDark ? "#1B1F23" : "#FFFFFF" }}
            />
            <h3
              className="mt-3 text-xl font-semibold"
              style={{ color: isDark ? "#FFFFFF" : "#000000" }}
            >
              Your Name
            </h3>
            <p style={{ color: isDark ? "#B7BFC7" : "#666666" }}>
              Professional Title
            </p>
            <p
              className="text-sm mt-1"
              style={{ color: isDark ? "#9CA3AF" : "#8A8A8A" }}
            >
              Company Name · Location
            </p>
            <p className="text-sm mt-2" style={{ color: "#0A66C2" }}>
              500+ connections
            </p>
            <div className="flex space-x-2 mt-3">
              <Button
                className="px-4 py-1 text-sm"
                style={{
                  backgroundColor: "#0A66C2",
                  color: "#FFFFFF",
                  border: "none",
                }}
              >
                Connect
              </Button>
              <Button
                variant="outline"
                className="px-4 py-1 text-sm"
                style={{
                  borderColor: "#0A66C2",
                  color: "#0A66C2",
                  backgroundColor: "transparent",
                }}
              >
                Message
              </Button>
            </div>
          </div>
        </div>
        <div
          className="mt-4 rounded p-3"
          style={{ backgroundColor: isDark ? "#1B1F23" : "#F3F2EF" }}
        >
          <p
            className="text-sm font-semibold mb-2"
            style={{ color: isDark ? "#FFFFFF" : "#000000" }}
          >
            Recent Activity
          </p>
          <div className="flex items-start space-x-2">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="LinkedIn activity"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="text-xs">
              <p style={{ color: isDark ? "#FFFFFF" : "#000000" }}>
                <span className="font-semibold">Your Name</span> updated their
                profile photo
              </p>
              <p style={{ color: isDark ? "#9CA3AF" : "#8A8A8A" }}>
                2 hours ago
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
