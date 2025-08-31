"use client";

import { Phone, Search, Video } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WhatsAppPreviewProps {
  imageUrl: string;
}

export default function WhatsAppPreview({ imageUrl }: WhatsAppPreviewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">WhatsApp</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="rounded-lg overflow-hidden"
          style={{ backgroundColor: isDark ? "#0B141A" : "#F0F2F5" }}
        >
          <div
            className="p-3 flex items-center justify-between"
            style={{
              backgroundColor: isDark ? "#202C33" : "#008069",
              color: "#FFFFFF",
            }}
          >
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
              <Video className="w-5 h-5" />
              <Phone className="w-5 h-5" />
              <Search className="w-5 h-5" />
            </div>
          </div>
          <div
            className="p-4"
            style={{ backgroundColor: isDark ? "#0B141A" : "#E5DDD5" }}
          >
            <div
              className="rounded-lg p-3 max-w-[80%] ml-auto mb-2"
              style={{ backgroundColor: isDark ? "#005C4B" : "#D9FDD3" }}
            >
              <p
                className="text-sm"
                style={{ color: isDark ? "#E9EDEF" : "#111B21" }}
              >
                Check out my new profile picture!
              </p>
              <p
                className="text-xs text-right mt-1"
                style={{ color: isDark ? "#8696A0" : "#667781" }}
              >
                12:34 PM
              </p>
            </div>
            <div
              className="rounded-lg p-3 max-w-[80%]"
              style={{ backgroundColor: isDark ? "#202C33" : "#FFFFFF" }}
            >
              <p
                className="text-sm"
                style={{ color: isDark ? "#E9EDEF" : "#111B21" }}
              >
                Looks great! 👍
              </p>
              <p
                className="text-xs text-right mt-1"
                style={{ color: isDark ? "#8696A0" : "#667781" }}
              >
                12:35 PM ✓✓
              </p>
            </div>
          </div>
        </div>
        <div
          className="mt-4 border rounded-lg p-4"
          style={{
            backgroundColor: isDark ? "#111B21" : "#FFFFFF",
            borderColor: isDark ? "#2A3942" : "#E9EDEF",
          }}
        >
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: isDark ? "#E9EDEF" : "#111B21" }}
          >
            Contact Info
          </p>
          <div className="flex items-center space-x-4">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="WhatsApp profile large"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h3
                className="font-semibold"
                style={{ color: isDark ? "#E9EDEF" : "#111B21" }}
              >
                Contact Name
              </h3>
              <p
                className="text-sm"
                style={{ color: isDark ? "#8696A0" : "#667781" }}
              >
                +1 234 567 8900
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: isDark ? "#8696A0" : "#667781" }}
              >
                Hey there! I am using WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
