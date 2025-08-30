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
  const operationIdRef = useRef(0);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Zoom handlers
  const handleZoomIn = () => {
    const newScale = Math.min(scale * 1.2, 5);
    setScale(newScale);
    setPosition((prev) => constrainPosition(prev, newScale));
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale * 0.8, 0.1);
    setScale(newScale);
    setPosition((prev) => constrainPosition(prev, newScale));
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
    const initialPosition = {
      x: (width - img.width * initialScale) / 2,
      y: (height - img.height * initialScale) / 2,
    };
    setPosition(constrainPosition(initialPosition, initialScale));
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 0.1), 5);
    setScale(newScale);
    setPosition((prev) => constrainPosition(prev, newScale));
  };

  return (
    <div className="relative">
      <div className="relative flex justify-center mb-4">
        <div className="relative">
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
          <div
            className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: `radial-gradient(farthest-side at center, transparent calc(100%), rgba(160, 160, 160, 0.5) calc(100%))`,
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
              <div className="text-muted-foreground">Loading image...</div>
            </div>
          )}
        </div>
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
