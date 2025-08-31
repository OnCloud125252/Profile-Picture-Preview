"use client";

import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SlackPreviewProps {
  imageUrl: string;
}

export default function SlackPreview({ imageUrl }: SlackPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Slack</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border rounded-lg p-4"
          style={{
            backgroundColor: isDark ? "#1A1D21" : "#FFFFFF",
            borderColor: isDark ? "#565856" : "#E1E1E1",
          }}
        >
          <div className="flex items-start space-x-3 mb-4">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Slack profile"
              className="w-9 h-9 rounded object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span
                  className="font-semibold text-sm"
                  style={{ color: isDark ? "#D1D2D3" : "#1D1C1D" }}
                >
                  Your Name
                </span>
                <span
                  className="text-xs"
                  style={{ color: isDark ? "#ABABAD" : "#616061" }}
                >
                  12:34 PM
                </span>
              </div>
              <p
                className="text-sm mt-1"
                style={{ color: isDark ? "#D1D2D3" : "#1D1C1D" }}
              >
                Hey team! Just updated my profile picture 📸
              </p>
            </div>
          </div>
          <div
            className="border-l-4 pl-3 ml-5"
            style={{ borderColor: isDark ? "#565856" : "#DDDDDD" }}
          >
            <p
              className="text-xs"
              style={{ color: isDark ? "#ABABAD" : "#616061" }}
            >
              Thread
            </p>
            <div className="flex items-center space-x-2 mt-1">
              {/** biome-ignore lint/performance/noImgElement: using base64 */}
              <img
                src={imageUrl}
                alt="Slack reply"
                className="w-6 h-6 rounded object-cover"
              />
              <p
                className="text-sm"
                style={{ color: isDark ? "#D1D2D3" : "#1D1C1D" }}
              >
                Looking good! 👍
              </p>
            </div>
          </div>
        </div>
        <div
          className="mt-4 rounded-lg p-4"
          style={{ backgroundColor: isDark ? "#222529" : "#F8F8F8" }}
        >
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: isDark ? "#ABABAD" : "#696969" }}
          >
            PROFILE
          </p>
          <div className="flex items-center space-x-3">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Slack profile large"
              className="w-16 h-16 rounded object-cover"
            />
            <div>
              <h3
                className="font-semibold"
                style={{ color: isDark ? "#D1D2D3" : "#1D1C1D" }}
              >
                Your Name
              </h3>
              <p
                className="text-sm"
                style={{ color: isDark ? "#3BB33D" : "#2D9E2E" }}
              >
                Active
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: isDark ? "#ABABAD" : "#616061" }}
              >
                Local time: 12:34 PM
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <p
              className="text-sm"
              style={{ color: isDark ? "#D1D2D3" : "#1D1C1D" }}
            >
              <span style={{ color: isDark ? "#ABABAD" : "#616061" }}>
                Title:
              </span>{" "}
              Software Developer
            </p>
            <p
              className="text-sm"
              style={{ color: isDark ? "#D1D2D3" : "#1D1C1D" }}
            >
              <span style={{ color: isDark ? "#ABABAD" : "#616061" }}>
                Email:
              </span>{" "}
              you@example.com
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
