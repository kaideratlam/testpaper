import { useState } from 'react';

interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

export function useImageResize(initialSize: Size = { width: 200, height: 200 }) {
  const [size, setSize] = useState<Size>(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({
      x: e.clientX - size.width,
      y: e.clientY - size.height,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const newWidth = e.clientX - startPos.x;
    const newHeight = e.clientY - startPos.y;

    setSize({
      width: Math.max(50, newWidth),
      height: Math.max(50, newHeight),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return {
    size,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}