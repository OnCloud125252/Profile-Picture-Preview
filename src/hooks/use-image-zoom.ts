import { useCallback, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface UseImageZoomProps {
  width: number;
  height: number;
  minScale: number;
  maxScale: number;
  constrainPosition: (pos: Position, scale: number) => Position;
}

export function useImageZoom({
  width,
  height,
  minScale,
  maxScale,
  constrainPosition,
}: UseImageZoomProps) {
  const [scale, setScale] = useState(1);

  const handleZoom = useCallback(
    (
      delta: number,
      currentPosition: Position,
    ): { scale: number; position: Position } => {
      const newScale = Math.min(Math.max(scale * delta, minScale), maxScale);
      const scaleFactor = newScale / scale;

      // Calculate center point
      const centerX = width / 2;
      const centerY = height / 2;

      // Adjust position to zoom towards/from center
      const newPosition = {
        x: centerX - (centerX - currentPosition.x) * scaleFactor,
        y: centerY - (centerY - currentPosition.y) * scaleFactor,
      };

      const constrainedPosition = constrainPosition(newPosition, newScale);

      setScale(newScale);

      return { scale: newScale, position: constrainedPosition };
    },
    [scale, minScale, maxScale, width, height, constrainPosition],
  );

  const setScaleAndPosition = useCallback(
    (newScale: number, currentPosition: Position): Position => {
      const scaleFactor = newScale / scale;

      // Calculate center point
      const centerX = width / 2;
      const centerY = height / 2;

      // Adjust position to zoom towards/from center
      const newPosition = {
        x: centerX - (centerX - currentPosition.x) * scaleFactor,
        y: centerY - (centerY - currentPosition.y) * scaleFactor,
      };

      setScale(newScale);
      return constrainPosition(newPosition, newScale);
    },
    [scale, width, height, constrainPosition],
  );

  return {
    scale,
    setScale,
    handleZoom,
    setScaleAndPosition,
  };
}
