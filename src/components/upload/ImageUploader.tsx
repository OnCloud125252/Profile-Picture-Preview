"use client";

import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import ImageEditor from "./ImageEditor";

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (file?.type?.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setPreview(result);
        setIsEditing(true);
        onImageUpload(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    setOriginalImage(null);
    setIsEditing(false);
    onImageUpload("");
  };

  const handleImageEdit = (editedImageUrl: string) => {
    setPreview(editedImageUrl);
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
        preview ? "bg-muted/50" : "bg-background",
      )}
    >
      <button
        type="reset"
        onClick={clearImage}
        className="cursor-pointer absolute top-2 right-2 p-1 bg-destructive text-white rounded-md"
      >
        <X className="h-4 w-4" />
      </button>
      {preview && isEditing ? (
        <ImageEditor
          imageUrl={originalImage || preview}
          onImageEdit={handleImageEdit}
          width={400}
          height={400}
        />
      ) : preview ? (
        <div className="relative">
          {/** biome-ignore lint/performance/noImgElement: using base64 */}
          <img
            src={preview}
            alt="Preview"
            className="mx-auto max-h-64 rounded-lg object-contain"
          />
          <button
            type="reset"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
          >
            <X className="h-4 w-4" />
          </button>
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
