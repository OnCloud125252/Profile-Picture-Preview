import { useCallback, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface UseImageDragProps {
  width: number;
  height: number;
  scale: number;
  onDragEnd?: () => void;
}

export function useImageDrag({
  width,
  height,
  scale,
  onDragEnd,
}: UseImageDragProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  const constrainPosition = useCallback(
    (pos: Position, currentScale: number): Position => {
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

  const handleDragStart = useCallback(
    (clientX: number, clientY: number) => {
      setIsDragging(true);
      setDragStart({
        x: clientX - position.x,
        y: clientY - position.y,
      });
    },
    [position],
  );

  const handleDragMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !imageRef.current) {
        return;
      }

      const img = imageRef.current;
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      const minX = Math.min(0, width - scaledWidth);
      const maxX = Math.max(0, width - scaledWidth);
      const minY = Math.min(0, height - scaledHeight);
      const maxY = Math.max(0, height - scaledHeight);

      const newX = clientX - dragStart.x;
      const newY = clientY - dragStart.y;

      setPosition({
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY)),
      });
    },
    [isDragging, scale, width, height, dragStart],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    onDragEnd?.();
  }, [onDragEnd]);

  const setImageRef = useCallback((image: HTMLImageElement) => {
    imageRef.current = image;
  }, []);

  return {
    position,
    setPosition,
    isDragging,
    imageRef,
    setImageRef,
    constrainPosition,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
}
