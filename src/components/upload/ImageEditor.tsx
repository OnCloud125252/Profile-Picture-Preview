"use client";

import { Expand, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageEditorProps {
  imageUrl: string;
  onImageEdit: (editedImageUrl: string) => void;
  width?: number;
  height?: number;
}

export default function ImageEditor({
  imageUrl,
  onImageEdit,
  width = 400,
  height = 400,
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Load image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setIsLoading(false);

      // Calculate initial scale to fit image
      const scaleX = width / img.width;
      const scaleY = height / img.height;
      const initialScale = Math.max(scaleX, scaleY);
      setScale(initialScale);

      // Center the image
      setPosition({
        x: (width - img.width * initialScale) / 2,
        y: (height - img.height * initialScale) / 2,
      });
    };
    img.src = imageUrl;
  }, [imageUrl, width, height]);

  // Draw image on canvas
  const drawImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;

    if (!canvas || !ctx || !img) {
      return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Save context
    ctx.save();

    // Draw image with transformations
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    // Restore context
    ctx.restore();

    // Export the edited image
    canvas.toBlob((blob) => {
      if (blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onImageEdit(result);
        };
        reader.readAsDataURL(blob);
      }
    });
  }, [scale, position, width, height, onImageEdit]);

  // Redraw when state changes
  useEffect(() => {
    if (!isLoading) {
      drawImage();
    }
  }, [drawImage, isLoading]);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) {
      return;
    }

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging) {
      return;
    }
    const touch = e.touches[0];

    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev * 0.8, 0.1));
  };

  const handleReset = () => {
    const img = imageRef.current;
    if (!img) {
      return;
    }

    const scaleX = width / img.width;
    const scaleY = height / img.height;
    const initialScale = Math.max(scaleX, scaleY);
    setScale(initialScale);
    setPosition({
      x: (width - img.width * initialScale) / 2,
      y: (height - img.height * initialScale) / 2,
    });
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(prev * delta, 0.1), 5));
  };

  return (
    <div className="relative">
      <div className="relative flex justify-center mb-4">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className={cn(
            "border border-gray-500 rounded-lg",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
            <div className="text-muted-foreground">Loading image...</div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          disabled={scale <= 0.1}
          className="cursor-pointer"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          disabled={scale >= 5}
          className="cursor-pointer"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="cursor-pointer"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Drag to move • Scroll to zoom • {Math.round(scale * 100)}%
      </p>
    </div>
  );
}
