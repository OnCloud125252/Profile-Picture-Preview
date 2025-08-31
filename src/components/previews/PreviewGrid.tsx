"use client";

import { ChevronDown } from "lucide-react";
import DiscordPreview from "./DiscordPreview";
import FacebookPreview from "./FacebookPreview";
import GitHubPreview from "./GitHubPreview";
import InstagramPreview from "./InstagramPreview";
import LinkedInPreview from "./LinkedInPreview";
import SlackPreview from "./SlackPreview";
import TwitterPreview from "./TwitterPreview";
import WhatsAppPreview from "./WhatsAppPreview";

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
