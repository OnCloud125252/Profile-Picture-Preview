"use client";

import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TwitterPreviewProps {
  imageUrl: string;
}

export default function TwitterPreview({ imageUrl }: TwitterPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">X (Twitter)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border rounded-2xl p-4"
          style={{
            backgroundColor: isDark ? "#000000" : "#FFFFFF",
            borderColor: isDark ? "#2F3336" : "#EFF3F4",
          }}
        >
          <div className="flex space-x-3">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Twitter profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-1">
                <span
                  className="font-bold"
                  style={{ color: isDark ? "#F7F9F9" : "#0F1419" }}
                >
                  Your Name
                </span>
                <svg className="w-4 h-4" fill="#1D9BF0" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className="text-sm"
                  style={{ color: isDark ? "#71767B" : "#536471" }}
                >
                  @username · 1m
                </span>
              </div>
              <p
                className="mt-2 text-sm"
                style={{ color: isDark ? "#F7F9F9" : "#0F1419" }}
              >
                Just updated my profile picture! What do you think?
              </p>
              <div
                className="flex justify-between mt-4"
                style={{ color: isDark ? "#71767B" : "#536471" }}
              >
                <MessageCircle className="w-5 h-5 cursor-pointer hover:text-[#1D9BF0]" />
                <Repeat2 className="w-5 h-5 cursor-pointer hover:text-[#00BA7C]" />
                <Heart className="w-5 h-5 cursor-pointer hover:text-[#F91880]" />
                <Share className="w-5 h-5 cursor-pointer hover:text-[#1D9BF0]" />
              </div>
            </div>
          </div>
        </div>
        <div
          className="mt-4 rounded-lg p-4"
          style={{ backgroundColor: isDark ? "#16181C" : "#F7F9F9" }}
        >
          <div className="flex items-center space-x-4">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Twitter profile large"
              className="w-24 h-24 rounded-full object-cover border-4"
              style={{ borderColor: isDark ? "#000000" : "#FFFFFF" }}
            />
            <div>
              <h3
                className="font-bold text-xl"
                style={{ color: isDark ? "#F7F9F9" : "#0F1419" }}
              >
                Your Name
              </h3>
              <p style={{ color: isDark ? "#71767B" : "#536471" }}>@username</p>
              <p
                className="text-sm mt-1"
                style={{ color: isDark ? "#F7F9F9" : "#0F1419" }}
              >
                Your bio goes here
              </p>
              <div
                className="flex space-x-4 mt-2 text-sm"
                style={{ color: isDark ? "#71767B" : "#536471" }}
              >
                <span>
                  <span
                    className="font-bold"
                    style={{ color: isDark ? "#F7F9F9" : "#0F1419" }}
                  >
                    123
                  </span>{" "}
                  Following
                </span>
                <span>
                  <span
                    className="font-bold"
                    style={{ color: isDark ? "#F7F9F9" : "#0F1419" }}
                  >
                    456
                  </span>{" "}
                  Followers
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
