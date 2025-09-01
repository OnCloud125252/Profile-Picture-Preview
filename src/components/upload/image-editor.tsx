"use client";

import { Download, Undo2, Upload } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useImageDrag } from "@/hooks/use-image-drag";
import { useImageZoom } from "@/hooks/use-image-zoom";
import { useMobileDetector } from "@/hooks/use-mobile-detector";
import { cn } from "@/lib/utils";

// Constants
const DEFAULT_CANVAS_SIZE = 1200;
const MAX_SCALE = 5;
const ZOOM_DELTA_IN = 1.1;
const ZOOM_DELTA_OUT = 0.9;
const MAX_SCALE_PERCENTAGE = 500;
const KB_SIZE = 1024;
const MB_SIZE = 1024 * 1024;
const EXPORT_FORMAT = "image/jpeg" as const;
const EXPORT_FILENAME = "profile-picture.jpg";

interface Dimensions {
  width: number;
  height: number;
}

interface ImageEditorProps {
  /** The source URL of the image to edit */
  imageUrl: string;
  /** Callback fired when the image is edited with the edited image data URL */
  onImageEdit: (editedImageUrl: string) => void;
  /** Optional callback to handle re-uploading a new image */
  onReupload?: () => void;
  /** Canvas width in pixels (default: 1200) */
  width?: number;
  /** Canvas height in pixels (default: 1200) */
  height?: number;
}

/**
 * ImageEditor component for cropping and adjusting profile pictures
 * Supports drag-to-move and zoom functionality with mobile touch support
 */
export default function ImageEditor({
  imageUrl,
  onImageEdit,
  onReupload,
  width = DEFAULT_CANVAS_SIZE,
  height = DEFAULT_CANVAS_SIZE,
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const operationIdRef = useRef(0);
  const updateRAFRef = useRef<number | null>(null);
  const fileSizeRAFRef = useRef<number | null>(null);
  const isCalculatingFileSizeRef = useRef(false);
  const hasPendingFileSizeRef = useRef(false);
  const [imageFileSize, setImageFileSize] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [minScale, setMinScale] = useState(1);
  const { isMobileByFeatures } = useMobileDetector();
  const [inputImageDimensions, setInputImageDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  // Update the exportCanvas callback
  const exportCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    // Increment operation ID to track the latest operation
    const currentOperationId = ++operationIdRef.current;

    if (currentOperationId === operationIdRef.current) {
      const result = canvas.toDataURL(EXPORT_FORMAT);
      onImageEdit(result);
      calculateImageFileSize();
    }
  }, [onImageEdit]);

  // Custom hooks for drag and zoom functionality
  const {
    position,
    setPosition,
    isDragging,
    imageRef,
    setImageRef,
    constrainPosition,
    handleDragStart,
    handleDragMove,
    handleDragEnd: dragEnd,
  } = useImageDrag({
    width,
    height,
    scale: 1,
    onDragEnd: () => {
      if (updateRAFRef.current) {
        cancelAnimationFrame(updateRAFRef.current);
      }
      exportCanvas();
    },
  });

  const { scale, setScale, handleZoom, setScaleAndPosition } = useImageZoom({
    width,
    height,
    minScale,
    maxScale: MAX_SCALE,
    constrainPosition,
  });

  /**
   * Formats file size in bytes to human-readable format
   */
  const formatFileSize = useCallback((sizeInBytes: number): string => {
    if (sizeInBytes < KB_SIZE) {
      return `${sizeInBytes} B`;
    }
    if (sizeInBytes < MB_SIZE) {
      return `${(sizeInBytes / KB_SIZE).toFixed(1)} KB`;
    }
    return `${(sizeInBytes / MB_SIZE).toFixed(1)} MB`;
  }, []);

  // Load image
  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setImageRef(image);
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
  }, [
    imageUrl,
    width,
    height,
    constrainPosition,
    setImageRef,
    setScale,
    setPosition,
  ]);

  /**
   * Draws the image on the canvas with current transformations
   */
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
  }, [scale, position]);

  const downloadImage = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });

    if (!canvas || !ctx) {
      return;
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = EXPORT_FILENAME;
        link.click();

        // Clean up the URL object after download
        setTimeout(() => URL.revokeObjectURL(link.href), 100);
      }
    });
  }, []);

  const performFileSizeCalculation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      isCalculatingFileSizeRef.current = false;
      return;
    }

    canvas.toBlob((blob) => {
      if (blob) {
        setImageFileSize(formatFileSize(blob.size));
      }

      fileSizeRAFRef.current = requestAnimationFrame(() => {
        isCalculatingFileSizeRef.current = false;

        if (hasPendingFileSizeRef.current) {
          hasPendingFileSizeRef.current = false;
          isCalculatingFileSizeRef.current = true;
          performFileSizeCalculation();
        }
      });
    }, EXPORT_FORMAT);
  }, [formatFileSize]);

  const calculateImageFileSize = useCallback(() => {
    if (isCalculatingFileSizeRef.current) {
      // Mark that we have a pending calculation
      hasPendingFileSizeRef.current = true;
      return;
    }

    isCalculatingFileSizeRef.current = true;
    performFileSizeCalculation();
  }, [performFileSizeCalculation]);

  /**
   * Draws and exports the canvas with debouncing during drag operations
   */
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

      const delta = e.deltaY > 0 ? ZOOM_DELTA_OUT : ZOOM_DELTA_IN;
      const { position: newPosition } = handleZoom(delta, position);
      setPosition(newPosition);
    };

    canvas.addEventListener("wheel", handleWheelEvent, { passive: false });

    return () => {
      canvas.removeEventListener("wheel", handleWheelEvent);
    };
  }, [position, handleZoom, setPosition]);

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
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      handleDragStart(e.clientX, e.clientY);
    },
    [handleDragStart],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      handleDragMove(e.clientX, e.clientY);
    },
    [handleDragMove],
  );

  const handleMouseUp = useCallback(() => {
    dragEnd();
  }, [dragEnd]);

  const handleMouseLeave = useCallback(() => {
    dragEnd();
  }, [dragEnd]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      const touch = e.touches[0];
      handleDragStart(touch.clientX, touch.clientY);
    },
    [handleDragStart],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      const touch = e.touches[0];
      handleDragMove(touch.clientX, touch.clientY);
    },
    [handleDragMove],
  );

  const handleTouchEnd = useCallback(() => {
    dragEnd();
  }, [dragEnd]);

  /**
   * Resets the image to its initial position and scale
   */
  const handleReset = useCallback(() => {
    const img = imageRef.current;
    if (!img) {
      return;
    }

    const scaleX = width / img.width;
    const scaleY = height / img.height;
    const initialScale = Math.max(scaleX, scaleY);
    setScale(initialScale);
    setMinScale(initialScale);
    const initialPosition = {
      x: (width - img.width * initialScale) / 2,
      y: (height - img.height * initialScale) / 2,
    };
    setPosition(constrainPosition(initialPosition, initialScale));
  }, [width, height, constrainPosition, setScale, setMinScale, setPosition]);

  return (
    <div className="relative">
      <div className="relative flex justify-center mb-4">
        <div className="flex flex-col items-center gap-[0.1rem]">
          <div className="relative overflow-hidden rounded-lg">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={useMemo(
                () =>
                  cn(
                    "border border-gray-500 rounded-lg w-full max-w-96 aspect-square",
                    isDragging ? "cursor-grabbing" : "cursor-grab",
                    "will-change-transform",
                  ),
                [isDragging],
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
                  `Scale: ${Math.round(((scale - minScale) / (MAX_SCALE - minScale)) * MAX_SCALE_PERCENTAGE)}%`,
                [scale, minScale],
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
            value={[
              ((scale - minScale) / (MAX_SCALE - minScale)) *
                MAX_SCALE_PERCENTAGE,
            ]}
            min={0}
            max={MAX_SCALE_PERCENTAGE}
            step={1}
            onValueChange={useCallback(
              (values: number[]) => {
                const percent = values[0];
                const newScale =
                  minScale +
                  (percent / MAX_SCALE_PERCENTAGE) * (MAX_SCALE - minScale);

                const newPosition = setScaleAndPosition(newScale, position);
                setPosition(newPosition);
              },
              [minScale, position, setScaleAndPosition, setPosition],
            )}
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
                  `${DEFAULT_CANVAS_SIZE}x${DEFAULT_CANVAS_SIZE} • JPG${imageFileSize ? ` • ${imageFileSize}` : ""}`,
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
