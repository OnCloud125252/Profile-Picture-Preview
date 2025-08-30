"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DiscordPreviewProps {
  imageUrl: string;
}

export default function DiscordPreview({ imageUrl }: DiscordPreviewProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex justify-between items-center">
          <span className="text-lg">Discord</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="rounded-lg p-4 text-white"
          style={{ backgroundColor: "#36393F" }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              {/** biome-ignore lint/performance/noImgElement: using base64 */}
              <img
                src={imageUrl}
                alt="Discord profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                style={{ backgroundColor: "#3BA55D", borderColor: "#36393F" }}
              ></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">Username</span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "#5865F2" }}
                >
                  BOT
                </span>
              </div>
              <p className="text-xs" style={{ color: "#B5BAC1" }}>
                Playing a game
              </p>
            </div>
          </div>
          <div className="rounded p-3" style={{ backgroundColor: "#2F3136" }}>
            <p className="text-sm" style={{ color: "#72767D" }}>
              Today at 12:34 PM
            </p>
            <p className="text-sm mt-1" style={{ color: "#DCDDDE" }}>
              Just updated my profile picture!
            </p>
          </div>
        </div>
        <div
          className="mt-4 rounded-lg p-4"
          style={{ backgroundColor: "#292B2F" }}
        >
          <p className="text-xs mb-2" style={{ color: "#96989D" }}>
            USER PROFILE
          </p>
          <div className="flex items-center space-x-4">
            {/** biome-ignore lint/performance/noImgElement: using base64 */}
            <img
              src={imageUrl}
              alt="Discord profile large"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="text-white">
              <h3 className="font-bold">Username</h3>
              <p className="text-sm" style={{ color: "#B5BAC1" }}>
                #1234
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#3BA55D" }}
                ></div>
                <span className="text-sm" style={{ color: "#DCDDDE" }}>
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
