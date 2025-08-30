"use client";

import imageCompression, {
  Options as ImageCompressionOptions,
} from "browser-image-compression";
import { Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import ImageEditor from "./ImageEditor";

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

      const options: ImageCompressionOptions = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/jpeg",
        initialQuality: 0.5,
      };
      try {
        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImage(result);
          onImageUpload(result);
        };
      } catch (error) {
        console.error(error);
      } finally {
        setCompressing(false);
        setIsEditing(true);
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

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-8 pb-7 transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-border",
        compressing ? "bg-muted/50" : "bg-background",
      )}
    >
      {isEditing ? (
        <ImageEditor imageUrl={image || ""} onImageEdit={handleImageEdit} />
      ) : compressing ? (
        <div className="flex flex-col items-center justify-center my-16">
          <div className="text-center">
            <p className="text-xl font-medium">Compressing image...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="text-lg font-medium">Drop your image here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
