"use client";

import { ChevronDown } from "lucide-react";
import DiscordPreview from "./discord-preview";
import FacebookPreview from "./facebook-preview";
import GitHubPreview from "./github-preview";
import InstagramPreview from "./instagram-preview";
import LinkedInPreview from "./linkedin-preview";
import SlackPreview from "./slack-preview";
import TwitterPreview from "./twitter-preview";
import WhatsAppPreview from "./whatsapp-preview";

interface PreviewGridProps {
  imageUrl: string;
}

export default function PreviewGrid({ imageUrl }: PreviewGridProps) {
  return (
    <div>
      <div className="mb-12 flex justify-center">
        <div className="h-1 bg-linear-[to_right,transparent_0%,var(--muted)_20%_80%,transparent_100%] rounded-full w-full flex justify-center items-center">
          <div className="flex justify-center items-center gap-1 text-lg text-muted-foreground px-3 bg-linear-[to_right,transparent_0%,var(--background)_10%_90%,transparent_100%] animate-float-xs">
            <ChevronDown />
            <span>Previews</span>
            <ChevronDown />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <FacebookPreview imageUrl={imageUrl} />
        <InstagramPreview imageUrl={imageUrl} />
        <TwitterPreview imageUrl={imageUrl} />
        <GitHubPreview imageUrl={imageUrl} />
        <LinkedInPreview imageUrl={imageUrl} />
        <DiscordPreview imageUrl={imageUrl} />
        <SlackPreview imageUrl={imageUrl} />
        <WhatsAppPreview imageUrl={imageUrl} />
      </div>
    </div>
  );
}
