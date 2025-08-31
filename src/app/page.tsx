"use client";

import { useState } from "react";
import PreviewGrid from "@/components/previews/PreviewGrid";
import AnimatedGitHubIcon from "@/components/ui/AnimatedGitHubIcon";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import ImageUploader from "@/components/upload/ImageUploader";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // if (uploadedImage) {
  //   console.log("uploadedImage", uploadedImage);

  //   // convert base64 image to blob
  //   const convertBase64ToBlob = (base64Image: string) => {
  //     const byteString = atob(base64Image.split(",")[1]);
  //     const buffer = new ArrayBuffer(byteString.length);
  //     const view = new Uint8Array(buffer);
  //     for (let i = 0; i < byteString.length; i++) {
  //       view[i] = byteString.charCodeAt(i);
  //     }
  //     return new Blob([buffer], { type: "image/jpeg" });
  //   };

  //   console.log(convertBase64ToBlob(uploadedImage).size / 1024 / 1024);
  // }

  return (
    <div className="max-w-[96rem] mx-auto px-4 lg:px-12 py-8">
      <div className="absolute top-4 left-4">
        <AnimatedGitHubIcon />
      </div>
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile Picture Preview</h1>
        <p className="text-muted-foreground">
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
