import React, { useState, useRef } from 'react';
import { Move } from 'lucide-react';

interface Position {
  x: number;
  y: number;
}

interface DraggableImageProps {
  src: string;
  alt: string;
  initialSize?: { width: number; height: number };
}

export function DraggableImage({ src, alt, initialSize = { width: 200, height: 200 } }: DraggableImageProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef<Position>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent, type: 'drag' | 'resize') => {
    e.preventDefault();
    if (type === 'drag') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y
      });
    } else if (isResizing) {
      const newWidth = e.clientX - position.x;
      const newHeight = e.clientY - position.y;
      setSize({
        width: Math.max(50, newWidth),
        height: Math.max(50, newHeight)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="inline-block"
    >
      <div
        className="absolute top-0 left-0 p-1 bg-indigo-500 rounded-tl cursor-move"
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
      >
        <Move className="h-4 w-4 text-white" />
      </div>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain rounded-md"
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-500 cursor-se-resize rounded-tl"
        onMouseDown={(e) => handleMouseDown(e, 'resize')}
      />
    </div>
  );
}