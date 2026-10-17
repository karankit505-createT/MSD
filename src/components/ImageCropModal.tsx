import React, { useState, useRef, useEffect, useCallback } from "react";
import { Crop, ZoomIn, ZoomOut, Check, X, Move, RotateCw, RefreshCw } from "lucide-react";

export interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, croppedDataUrl: string) => void;
  title?: string;
  onUseOriginal?: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  title = "Crop Photograph",
  onUseOriginal,
}) => {
  // Simple square dimensions (1:1)
  const cropBoxSize = 240;

  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Reset state when modal opens with new image
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setImgLoaded(false);

      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
        setImgLoaded(true);
      };
      img.src = imageSrc;
    }
  }, [isOpen, imageSrc]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const origOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = origOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch pan handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Scroll wheel to zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.8), 3.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  // Compute base scale so image fills the square aperture
  const isRotatedSideways = rotation === 90 || rotation === 270;
  const effectiveWidth = isRotatedSideways ? naturalSize.height : naturalSize.width;
  const effectiveHeight = isRotatedSideways ? naturalSize.width : naturalSize.height;

  const baseScale =
    effectiveWidth && effectiveHeight
      ? Math.max(cropBoxSize / effectiveWidth, cropBoxSize / effectiveHeight)
      : 1;

  // Generate crisp square cropped image on canvas (600x600)
  const generateCroppedCanvas = useCallback((): HTMLCanvasElement | null => {
    const img = imgRef.current;
    if (!img || !imgLoaded) return null;

    const outSize = 600;
    const outCanvas = document.createElement("canvas");
    outCanvas.width = outSize;
    outCanvas.height = outSize;
    const ctx = outCanvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outSize, outSize);

    const scaleFactor = outSize / cropBoxSize;
    const imgExportWidth = naturalSize.width * baseScale * zoom * scaleFactor;
    const imgExportHeight = naturalSize.height * baseScale * zoom * scaleFactor;

    ctx.save();
    ctx.translate(outSize / 2 + pan.x * scaleFactor, outSize / 2 + pan.y * scaleFactor);
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
    ctx.drawImage(img, -imgExportWidth / 2, -imgExportHeight / 2, imgExportWidth, imgExportHeight);
    ctx.restore();

    return outCanvas;
  }, [imgLoaded, cropBoxSize, naturalSize, baseScale, zoom, pan, rotation]);

  const handleConfirmCrop = () => {
    const canvas = generateCroppedCanvas();
    if (!canvas) {
      onClose();
      return;
    }
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const dataUrl = canvas.toDataURL("image/jpeg", 0.94);
          onCropComplete(blob, dataUrl);
          onClose();
        } else {
          onClose();
        }
      },
      "image/jpeg",
      0.94
    );
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/65 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-hairline shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-hairline flex items-center justify-between bg-surface-soft/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF6200]/10 text-[#FF6200] flex items-center justify-center">
              <Crop size={17} />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-ink">{title}</h3>
              <p className="text-[11px] text-muted-editorial">
                Drag to center face, zoom to fit
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-muted-editorial hover:text-ink hover:bg-surface-soft transition-colors"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Crop Stage */}
        <div className="p-4 flex flex-col items-center">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            className="w-full h-[320px] bg-[#141416] rounded-xl relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          >
            {/* Draggable Transformed Image */}
            {imageSrc && (
              <div
                className="absolute pointer-events-none transition-transform duration-75 ease-out"
                style={{
                  width: `${naturalSize.width * baseScale * zoom}px`,
                  height: `${naturalSize.height * baseScale * zoom}px`,
                  left: "50%",
                  top: "50%",
                  transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) rotate(${rotation}deg)`,
                }}
              >
                <img
                  src={imageSrc}
                  alt="Crop Source"
                  className="w-full h-full object-fill pointer-events-none"
                  draggable={false}
                />
              </div>
            )}

            {/* Simple Square Aperture Window (1:1) */}
            <div
              className="relative z-10 pointer-events-none border-2 border-[#FF6200] shadow-[0_0_0_9999px_rgba(0,0,0,0.60)] rounded-xl"
              style={{
                width: `${cropBoxSize}px`,
                height: `${cropBoxSize}px`,
              }}
            >
              {/* Grid Lines */}
              <div className="w-full h-full relative overflow-hidden">
                <div className="absolute left-0 right-0 top-1/3 border-b border-white/25" />
                <div className="absolute left-0 right-0 top-2/3 border-b border-white/25" />
                <div className="absolute top-0 bottom-0 left-1/3 border-r border-white/25" />
                <div className="absolute top-0 bottom-0 left-2/3 border-r border-white/25" />

                {/* Subtle corner accents */}
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white" />
              </div>
            </div>

            {/* Helper Hint */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 text-[10px] text-white/80 pointer-events-none bg-black/50 py-0.5 px-2 rounded-full mx-auto w-max backdrop-blur-xs">
              <Move size={11} />
              <span>Drag to position face · Scroll to zoom</span>
            </div>
          </div>

          {/* Tools & Adjustment Controls */}
          <div className="w-full mt-3.5 space-y-2">
            <div className="flex items-center gap-2 px-1">
              {/* Zoom Slider */}
              <div className="flex-1 flex items-center gap-2 bg-surface-soft/60 px-3 py-1.5 rounded-lg border border-hairline">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(z - 0.2, 0.8))}
                  className="p-1 rounded text-muted-editorial hover:text-ink hover:bg-white transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut size={15} />
                </button>
                <input
                  type="range"
                  min="0.8"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#FF6200] cursor-pointer h-1.5"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
                  className="p-1 rounded text-muted-editorial hover:text-ink hover:bg-white transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn size={15} />
                </button>
              </div>

              {/* Rotate Button */}
              <button
                type="button"
                onClick={handleRotate}
                className="btn-secondary text-xs px-2.5 py-2 flex items-center gap-1.5"
                title="Rotate 90° clockwise"
              >
                <RotateCw size={14} />
                <span className="hidden sm:inline">Rotate</span>
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-lg border border-hairline bg-surface-soft/60 hover:bg-surface-soft text-muted-editorial hover:text-ink transition-colors"
                title="Reset zoom & position"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-surface-soft/80 border-t border-hairline flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onUseOriginal || onClose}
            className="text-xs text-muted-editorial hover:text-ink font-medium px-2 py-1.5 transition-colors"
            title="Use original image without cropping"
          >
            Use As Is
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs px-3.5 py-1.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              className="btn-primary-coral text-xs px-4 py-1.5 flex items-center gap-1.5 font-semibold shadow-xs"
            >
              <Check size={14} />
              <span>Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
