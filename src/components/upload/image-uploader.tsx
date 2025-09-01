"use client";

import {
  compress as compressImage,
  CompressionOptions as ImageCompressionOptions,
} from "@thaparoyal/image-compression";
import { ImagePlus } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import ImageEditor from "./image-editor";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  const handleFile = async (file: File) => {
    if (file?.type?.startsWith("image/")) {
      setCompressing(true);
      setImage(null);
      setIsEditing(false);

      const imageElement = new Image();
      const imageUrl = URL.createObjectURL(file);
      imageElement.src = imageUrl;

      await new Promise((resolve) => {
        imageElement.onload = resolve;
      });

      const originalDimensions = {
        width: imageElement.width,
        height: imageElement.height,
      };

      const minDimension = Math.min(
        originalDimensions.width,
        originalDimensions.height,
      );
      const upscaleFactor = 2400 / minDimension;

      const targetDimensions = {
        width: Math.round(originalDimensions.width * upscaleFactor),
        height: Math.round(originalDimensions.height * upscaleFactor),
      };

      const compressionOptions: ImageCompressionOptions = {
        maxSizeMB: 0.5,
        maxWidth: targetDimensions.width,
        maxHeight: targetDimensions.height,
        preferredFormat: "jpeg",
        quality: 0.9,
      };

      try {
        const compressedFile = await compressImage(file, compressionOptions);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(compressedFile);
        fileReader.onload = (event) => {
          const base64Result = event.target?.result as string;
          setImage(base64Result);
          onImageUpload(base64Result);
        };
      } catch (error) {
        console.error("Image compression failed:", error);
      } finally {
        setCompressing(false);
        setIsEditing(true);
        URL.revokeObjectURL(imageUrl); // Clean up the object URL
      }
    }
  };

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    await handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleImageEdit = (editedImageUrl: string) => {
    onImageUpload(editedImageUrl);
  };

  const handleReupload = () => {
    setImage(null);
    setIsEditing(false);
    onImageUpload("");
  };

  return (
    <div
      onDrop={isEditing ? undefined : handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative border-2 border-dashed rounded-lg pb-7 transition-colors p-4 md:p-8 ",
        isEditing
          ? "border-border"
          : isDragging
            ? "border-primary bg-primary/5"
            : "border-border",
        compressing ? "bg-muted/50" : "bg-background",
      )}
    >
      {isEditing ? (
        <ImageEditor
          imageUrl={image || ""}
          onImageEdit={handleImageEdit}
          onReupload={handleReupload}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 aspect-square">
          {compressing ? (
            <p className="text-xl font-medium">Compressing image...</p>
          ) : (
            <>
              <ImagePlus className="h-16 w-16 text-muted-foreground" />
              <div className="text-center">
                <p className="text-lg font-medium">Drop your image here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
