"use client";

import { useState } from "react";
import PreviewGrid from "@/components/previews/preview-grid";
import AnimatedGitHubIcon from "@/components/ui/animated-github-icon";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ImageUploader from "@/components/upload/image-uploader";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  return (
    <div className="max-w-[96rem] mx-auto px-4 lg:px-12 pb-8 pt-11 sm:p-8">
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
        <AnimatedGitHubIcon />
      </div>
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
        <ThemeToggle />
      </div>
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Profile Picture Preview
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Upload your profile picture and see how it looks across different
          platforms
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <ImageUploader onImageUpload={setUploadedImage} />
      </div>

      {uploadedImage && <PreviewGrid imageUrl={uploadedImage} />}
    </div>
  );
}
