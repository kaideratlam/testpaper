import React from 'react';
import { useImageResize } from '../hooks/useImageResize';

interface ResizableImageProps {
  src: string;
  alt: string;
  initialSize?: { width: number; height: number };
}

export function ResizableImage({ src, alt, initialSize }: ResizableImageProps) {
  const { size, handleMouseDown, handleMouseMove, handleMouseUp } = useImageResize(initialSize);

  return (
    <div className="relative inline-block mt-2">
      <img
        src={src}
        alt={alt}
        style={{ width: size.width, height: size.height }}
        className="object-cover rounded-md"
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-indigo-500 cursor-se-resize rounded-bl"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}