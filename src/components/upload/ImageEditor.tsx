"use client";

import { Expand } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
  const operationIdRef = useRef(0);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [minScale, setMinScale] = useState(1);
  const maxScale = 3; // 3x = 300%

  // Constrain position after scale changes
  const constrainPosition = useCallback(
    (pos: { x: number; y: number }, currentScale: number) => {
      if (!imageRef.current) {
        return pos;
      }

      const img = imageRef.current;
      const scaledWidth = img.width * currentScale;
      const scaledHeight = img.height * currentScale;

      const minX = Math.min(0, width - scaledWidth);
      const maxX = Math.max(0, width - scaledWidth);
      const minY = Math.min(0, height - scaledHeight);
      const maxY = Math.max(0, height - scaledHeight);

      return {
        x: Math.max(minX, Math.min(maxX, pos.x)),
        y: Math.max(minY, Math.min(maxY, pos.y)),
      };
    },
    [width, height],
  );

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
      setMinScale(initialScale);

      // Center the image or constrain if too large
      const initialPosition = {
        x: (width - img.width * initialScale) / 2,
        y: (height - img.height * initialScale) / 2,
      };
      setPosition(constrainPosition(initialPosition, initialScale));
    };
    img.src = imageUrl;
  }, [imageUrl, width, height, constrainPosition]);

  // Draw image on canvas (without exporting)
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;

    if (!canvas || !ctx || !img) {
      return;
    }

    ctx.save();

    // Draw image with transformations
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    // Restore context
    ctx.restore();
  }, [scale, position, width, height]);

  // Export the canvas to base64
  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // Increment operation ID to track the latest operation
    const currentOperationId = ++operationIdRef.current;

    // Export the edited image
    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }

      if (currentOperationId === operationIdRef.current) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = (e) => {
          const result = e.target?.result as string;
          onImageEdit(result);
        };
      }
    });
  }, [onImageEdit]);

  // Draw and export with debouncing
  const drawImage = useCallback(() => {
    drawCanvas();

    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    if (isDragging) {
      updateTimeoutRef.current = setTimeout(() => {
        exportCanvas();
      }, 1);
    } else {
      exportCanvas();
    }
  }, [drawCanvas, exportCanvas, isDragging]);

  // Redraw when state changes
  useEffect(() => {
    if (!isLoading) {
      drawImage();
    }
  }, [drawImage, isLoading]);

  // Add wheel event listener with passive: false
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      if (!imageRef.current) return;

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, minScale), maxScale);
      const scaleFactor = newScale / scale;

      // Calculate center point
      const centerX = width / 2;
      const centerY = height / 2;

      // Adjust position to zoom towards/from center
      const newPosition = {
        x: centerX - (centerX - position.x) * scaleFactor,
        y: centerY - (centerY - position.y) * scaleFactor,
      };

      setScale(newScale);
      setPosition(constrainPosition(newPosition, newScale));
    };

    canvas.addEventListener("wheel", handleWheelEvent, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheelEvent);
    };
  }, [scale, position, minScale, width, height, constrainPosition]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !imageRef.current) {
      return;
    }

    const img = imageRef.current;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    // Calculate boundaries to prevent gaps
    const minX = Math.min(0, width - scaledWidth);
    const maxX = Math.max(0, width - scaledWidth);
    const minY = Math.min(0, height - scaledHeight);
    const maxY = Math.max(0, height - scaledHeight);

    // Calculate new position
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Apply constraints
    setPosition({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Ensure final position is exported
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    exportCanvas();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    // Ensure final position is exported
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    exportCanvas();
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
    if (!isDragging || !imageRef.current) {
      return;
    }
    const touch = e.touches[0];
    const img = imageRef.current;
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;

    // Calculate boundaries to prevent gaps
    const minX = Math.min(0, width - scaledWidth);
    const maxX = Math.max(0, width - scaledWidth);
    const minY = Math.min(0, height - scaledHeight);
    const maxY = Math.max(0, height - scaledHeight);

    // Calculate new position
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;

    // Apply constraints
    setPosition({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // Ensure final position is exported
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    exportCanvas();
  };

  // Reset handler
  const handleReset = () => {
    const img = imageRef.current;
    if (!img) {
      return;
    }

    const scaleX = width / img.width;
    const scaleY = height / img.height;
    const initialScale = Math.max(scaleX, scaleY);
    setScale(initialScale);
    const initialPosition = {
      x: (width - img.width * initialScale) / 2,
      y: (height - img.height * initialScale) / 2,
    };
    setPosition(constrainPosition(initialPosition, initialScale));
  };

  return (
    <div className="relative">
      <div className="relative flex justify-center mb-4">
        <div className="relative overflow-hidden rounded-lg">
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
          />
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `radial-gradient(farthest-side at center, transparent calc(100%), rgba(160, 160, 160, 0.5) calc(100%))`,
            }}
          />
          <div className="absolute pointer-events-none h-[2px] w-full bg-[rgba(160,160,160,0.5)] top-1/3 -mt-[1px]" />
          <div className="absolute pointer-events-none h-[2px] w-full bg-[rgba(160,160,160,0.5)] top-2/3 -mt-[1px]" />
          <div className="absolute pointer-events-none w-[2px] h-full bg-[rgba(160,160,160,0.5)] left-1/3 top-0 -ml-[1px]" />
          <div className="absolute pointer-events-none w-[2px] h-full bg-[rgba(160,160,160,0.5)] left-2/3 top-0 -ml-[1px]" />
          <div className="absolute pointer-events-none h-[2px] w-[calc(100%*1.5)] bg-[rgba(160,160,160,0.5)] top-1/2 -mt-[1px] -left-1/4 rotate-45" />
          <div className="absolute pointer-events-none h-[2px] w-[calc(100%*1.5)] bg-[rgba(160,160,160,0.5)] top-1/2 -mt-[1px] -left-1/4 -rotate-45" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-muted-foreground">Loading image...</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center">
        <p className="text-center text-sm text-muted-foreground mb-3">
          Drag to move • Scroll to zoom •{" "}
          {Math.round(((scale - minScale) / (maxScale - minScale)) * 300)}%
        </p>
        <div className="flex items-center gap-4 w-full max-w-xs mb-2">
          <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
            0%
          </span>
          <Slider
            value={[((scale - minScale) / (maxScale - minScale)) * 300]}
            min={0}
            max={300}
            step={1}
            onValueChange={(values) => {
              const percent = values[0];
              const newScale =
                minScale + (percent / 300) * (maxScale - minScale);

              // Calculate center point
              const centerX = width / 2;
              const centerY = height / 2;
              const scaleFactor = newScale / scale;

              // Adjust position to zoom towards/from center
              const newPosition = {
                x: centerX - (centerX - position.x) * scaleFactor,
                y: centerY - (centerY - position.y) * scaleFactor,
              };

              setScale(newScale);
              setPosition(constrainPosition(newPosition, newScale));
            }}
            className="flex-1 cursor-ew-resize"
          />
          <span className="text-sm text-muted-foreground min-w-[3rem]">
            300%
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="cursor-pointer"
        >
          <Expand className="h-4 w-4" />
          <span className="ml-2">Reset scale and position</span>
        </Button>
      </div>
    </div>
  );
}
