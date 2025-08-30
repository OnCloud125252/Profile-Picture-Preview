"use client";

import { Link2, Mail, MapPin, Users } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GitHubPreviewProps {
  imageUrl: string;
}

export default function GitHubPreview({ imageUrl }: GitHubPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">GitHub</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="border rounded-lg p-4 overflow-scroll"
          style={{
            backgroundColor: isDark ? "#0D1117" : "#FFFFFF",
            borderColor: isDark ? "#30363D" : "#D0D7DE",
          }}
        >
          <div className="flex space-x-4">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="GitHub profile"
              className="w-20 h-20 rounded-full object-cover border-2"
              style={{ borderColor: isDark ? "#30363D" : "#D0D7DE" }}
            />
            <div className="flex-1">
              <h3
                className="text-xl font-semibold"
                style={{ color: isDark ? "#F0F6FC" : "#1F2328" }}
              >
                Your Name
              </h3>
              <p style={{ color: isDark ? "#8B949E" : "#656D76" }}>username</p>
              <p
                className="text-sm mt-2"
                style={{ color: isDark ? "#F0F6FC" : "#1F2328" }}
              >
                Your bio goes here
              </p>
              <div
                className="flex items-center space-x-4 mt-3 text-sm"
                style={{ color: isDark ? "#8B949E" : "#656D76" }}
              >
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>123 followers · 45 following</span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="mt-4 flex items-center space-x-4 text-sm"
            style={{ color: isDark ? "#8B949E" : "#656D76" }}
          >
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
          <div
            className="border rounded p-2 text-center"
            style={{
              backgroundColor: isDark ? "#0F3320" : "#DAFBE1",
              borderColor: isDark ? "#2EA04326" : "#1F883D26",
            }}
          >
            <p
              className="text-xs"
              style={{ color: isDark ? "#8B949E" : "#656D76" }}
            >
              Contributions
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: isDark ? "#3FB950" : "#1A7F37" }}
            >
              1,234
            </p>
          </div>
          <div
            className="border rounded p-2 text-center"
            style={{
              backgroundColor: isDark ? "#0C2D6B" : "#DDF4FF",
              borderColor: isDark ? "#388BFD26" : "#0969DA26",
            }}
          >
            <p
              className="text-xs"
              style={{ color: isDark ? "#8B949E" : "#656D76" }}
            >
              Repositories
            </p>
            <p
              className="text-lg font-bold"
              style={{ color: isDark ? "#58A6FF" : "#0969DA" }}
            >
              42
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
