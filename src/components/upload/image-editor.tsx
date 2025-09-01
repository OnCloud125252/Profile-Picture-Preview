"use client";

import { Download, Undo2, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMobileDetector } from "@/hooks/use-mobile-detector";
import { cn } from "@/lib/utils";

interface ImageEditorProps {
  imageUrl: string;
  onImageEdit: (editedImageUrl: string) => void;
  onReupload?: () => void;
  width?: number;
  height?: number;
}

export default function ImageEditor({
  imageUrl,
  onImageEdit,
  onReupload,
  width = 1200,
  height = 1200,
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const operationIdRef = useRef(0);
  const updateRAFRef = useRef<number | null>(null);
  const fileSizeRAFRef = useRef<number | null>(null);
  const isCalculatingFileSizeRef = useRef(false);
  const hasPendingFileSizeRef = useRef(false);
  const [imageFileSize, setImageFileSize] = useState<string>(""); // formatted size
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const maxScale = 5;
  const [minScale, setMinScale] = useState(1);
  const [scale, setScale] = useState(1);
  const { isMobileByFeatures } = useMobileDetector();
  const [inputImageDimensions, setInputImageDimensions] = useState({
    width: 0,
    height: 0,
  });

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
    const image = new Image();
    image.onload = () => {
      imageRef.current = image;
      setIsLoading(false);

      setInputImageDimensions({ width: image.width, height: image.height });

      // Calculate initial scale to fit image
      const scaleX = width / image.width;
      const scaleY = height / image.height;
      const initialScale = Math.max(scaleX, scaleY);
      setScale(initialScale);
      setMinScale(initialScale);

      // Center the image or constrain if too large
      const initialPosition = {
        x: (width - image.width * initialScale) / 2,
        y: (height - image.height * initialScale) / 2,
      };
      setPosition(constrainPosition(initialPosition, initialScale));
    };
    image.src = imageUrl;
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

    ctx.restore();
  }, [scale, position, width, height]);

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });

    if (!canvas || !ctx) {
      return;
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "profile-picture.jpg";
        link.click();
      }
    });
  };

  const performFileSizeCalculation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      isCalculatingFileSizeRef.current = false;
      return;
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const sizeInBytes = blob.size;
        let formattedSize = "";

        if (sizeInBytes < 1024) {
          formattedSize = `${sizeInBytes} B`;
        } else if (sizeInBytes < 1024 * 1024) {
          formattedSize = `${(sizeInBytes / 1024).toFixed(1)} KB`;
        } else {
          formattedSize = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
        }

        setImageFileSize(formattedSize);
      }

      fileSizeRAFRef.current = requestAnimationFrame(() => {
        isCalculatingFileSizeRef.current = false;

        if (hasPendingFileSizeRef.current) {
          hasPendingFileSizeRef.current = false;
          isCalculatingFileSizeRef.current = true;
          performFileSizeCalculation();
        }
      });
    }, "image/jpeg");
  }, []);

  const calculateImageFileSize = useCallback(() => {
    if (isCalculatingFileSizeRef.current) {
      // Mark that we have a pending calculation
      hasPendingFileSizeRef.current = true;
      return;
    }

    isCalculatingFileSizeRef.current = true;
    performFileSizeCalculation();
  }, [performFileSizeCalculation]);

  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // Increment operation ID to track the latest operation
    const currentOperationId = ++operationIdRef.current;

    if (currentOperationId === operationIdRef.current) {
      const result = canvas.toDataURL("image/jpeg");
      onImageEdit(result);
      calculateImageFileSize();
    }
  }, [onImageEdit, calculateImageFileSize]);

  // Draw and export with debouncing
  const drawImage = useCallback(() => {
    drawCanvas();

    if (updateRAFRef.current) {
      cancelAnimationFrame(updateRAFRef.current);
    }

    if (isDragging) {
      updateRAFRef.current = requestAnimationFrame(() => {
        exportCanvas();
      });
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
    if (!canvas) {
      return;
    }

    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      if (!imageRef.current) {
        return;
      }

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

  useEffect(() => {
    return () => {
      if (updateRAFRef.current) {
        cancelAnimationFrame(updateRAFRef.current);
      }
      if (fileSizeRAFRef.current) {
        cancelAnimationFrame(fileSizeRAFRef.current);
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
    if (updateRAFRef.current) {
      cancelAnimationFrame(updateRAFRef.current);
    }
    exportCanvas();
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    // Ensure final position is exported
    if (updateRAFRef.current) {
      cancelAnimationFrame(updateRAFRef.current);
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
    if (updateRAFRef.current) {
      cancelAnimationFrame(updateRAFRef.current);
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
        <div className="flex flex-col items-center gap-[0.1rem]">
          <div className="relative overflow-hidden rounded-lg">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={cn(
                "border border-gray-500 rounded-lg w-full max-w-96 aspect-square",
                isDragging ? "cursor-grabbing" : "cursor-grab",
                "will-change-transform",
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
              className="absolute inset-0 rounded-lg pointer-events-none z-40"
              style={{
                background: `radial-gradient(farthest-side at center, transparent calc(100%), rgba(90, 90, 90, 0.7) calc(100%))`,
              }}
            />
            <div className="absolute pointer-events-none h-[2px] w-full bg-[rgba(160,160,160,0.5)] top-1/3 -mt-[1px] z-50" />
            <div className="absolute pointer-events-none h-[2px] w-full bg-[rgba(160,160,160,0.5)] top-2/3 -mt-[1px] z-50" />
            <div className="absolute pointer-events-none w-[2px] h-full bg-[rgba(160,160,160,0.5)] left-1/3 top-0 -ml-[1px] z-50" />
            <div className="absolute pointer-events-none w-[2px] h-full bg-[rgba(160,160,160,0.5)] left-2/3 top-0 -ml-[1px] z-50" />
            <div className="absolute pointer-events-none h-[2px] w-[calc(100%*1.5)] bg-[rgba(160,160,160,0.5)] top-1/2 -mt-[1px] -left-1/4 rotate-45 z-50" />
            <div className="absolute pointer-events-none h-[2px] w-[calc(100%*1.5)] bg-[rgba(160,160,160,0.5)] top-1/2 -mt-[1px] -left-1/4 -rotate-45 z-50" />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-muted-foreground">Loading image...</div>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {useMemo(
              () =>
                `${inputImageDimensions.width}x${inputImageDimensions.height}px • Drag to move • ${isMobileByFeatures ? "Pinch to zoom" : "Scroll to zoom"}`,
              [
                inputImageDimensions.width,
                inputImageDimensions.height,
                isMobileByFeatures,
              ],
            )}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-2.5 w-full max-w-xs">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-foreground w-10 text-left text-nowrap">
              {useMemo(
                () =>
                  `Scale: ${Math.round(((scale - minScale) / (maxScale - minScale)) * 500)}%`,
                [scale, minScale, maxScale],
              )}
            </span>
            <div
              className="flex items-center cursor-pointer relative ml-1 group"
              onClick={handleReset}
            >
              <Undo2 className="h-4 w-4 text-muted-foreground -mt-[0.09rem] mr-0.5" />
              <span className="text-muted-foreground text-xs">Reset</span>
            </div>
          </div>
          <Slider
            value={[((scale - minScale) / (maxScale - minScale)) * 500]}
            min={0}
            max={500}
            step={1}
            onValueChange={(values) => {
              const percent = values[0];
              const newScale =
                minScale + (percent / 500) * (maxScale - minScale);

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
            className="flex-1 cursor-ew-resize mb-2"
          />
        </div>
        <div className="w-full flex justify-center gap-2 flex-wrap">
          <div className="flex flex-col items-center gap-[0.1rem]">
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={downloadImage}
              className="cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span className="ml-2">Download cropped image</span>
            </Button>
            <span className="text-xs text-muted-foreground">
              {useMemo(
                () =>
                  `1200x1200 • JPG${imageFileSize ? ` • ${imageFileSize}` : ""}`,
                [imageFileSize],
              )}
            </span>
          </div>
          {onReupload && (
            <div className="flex flex-col items-center gap-[0.1rem]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onReupload}
                className="cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span className="ml-2">Upload new image</span>
              </Button>
              <span className="text-xs text-muted-foreground">
                Changes will be lost !
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
