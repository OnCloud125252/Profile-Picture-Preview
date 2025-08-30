"use client";

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
  );
}
