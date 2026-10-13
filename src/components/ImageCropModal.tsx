import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  Check,
  X,
  User,
  Sparkles,
  Sliders,
  Move,
} from "lucide-react";

export interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, croppedDataUrl: string) => void;
  aspectRatio?: number; // width / height, e.g. 3/4 = 0.75 for passport
  title?: string;
}

const ASPECT_RATIOS = [
  { label: "Passport (3:4)", value: 3 / 4, description: "Official Cadre ID Card standard" },
  { label: "Square (1:1)", value: 1 / 1, description: "Square profile avatar" },
  { label: "Portrait (4:5)", value: 4 / 5, description: "Standard photo print" },
];

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio: initialAspectRatio = 3 / 4,
  title = "Crop Cadre Passport Photograph",
}) => {
  const [selectedAspect, setSelectedAspect] = useState<number>(initialAspectRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [previewDataUrl, setPreviewDataUrl] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset state when a new image is loaded or modal opens
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

  // Lock body & html scroll when crop modal is open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.classList.add("modal-open");
      document.body.classList.add("modal-open");

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.documentElement.classList.remove("modal-open");
        document.body.classList.remove("modal-open");
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Mouse & Touch Pan Handling
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

  // Touch support for mobile devices
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

  // Wheel to zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY * -0.0015;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.7), 3.5));
  };

  // Compute live crop and preview
  const generateCroppedCanvas = useCallback((): HTMLCanvasElement | null => {
    const img = imgRef.current;
    if (!img || !imgLoaded) return null;

    // Target passport high-resolution output (e.g. 600 x 800)
    const outWidth = 600;
    const outHeight = Math.round(outWidth / selectedAspect);

    const outCanvas = document.createElement("canvas");
    outCanvas.width = outWidth;
    outCanvas.height = outHeight;
    const ctx = outCanvas.getContext("2d");
    if (!ctx) return null;

    // Fill clean white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, outWidth, outHeight);

    // Save context state for transformations
    ctx.save();

    // Center of output canvas
    ctx.translate(outWidth / 2, outHeight / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Swap natural dimensions if rotated 90 or 270 deg
    const isRotated90 = rotation === 90 || rotation === 270;
    const currentW = isRotated90 ? naturalSize.height : naturalSize.width;
    const currentH = isRotated90 ? naturalSize.width : naturalSize.height;

    // Calculate base scale to cover the crop aperture
    const baseScale = Math.max(outWidth / currentW, outHeight / currentH);
    const totalScale = baseScale * zoom;

    // Calculate pan adjusted to output resolution
    // Viewport box assumption: crop box in UI is roughly 240px wide
    const uiCropWidth = 240;
    const panRatio = outWidth / uiCropWidth;

    const finalPanX = pan.x * panRatio;
    const finalPanY = pan.y * panRatio;

    // When rotated, pan direction needs to compensate rotation
    let drawPanX = finalPanX;
    let drawPanY = finalPanY;
    if (rotation === 90) {
      drawPanX = finalPanY;
      drawPanY = -finalPanX;
    } else if (rotation === 180) {
      drawPanX = -finalPanX;
      drawPanY = -finalPanY;
    } else if (rotation === 270) {
      drawPanX = -finalPanY;
      drawPanY = finalPanX;
    }

    ctx.translate(drawPanX, drawPanY);

    // Draw the image centered
    const drawW = naturalSize.width * totalScale;
    const drawH = naturalSize.height * totalScale;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

    ctx.restore();

    return outCanvas;
  }, [imgLoaded, naturalSize, selectedAspect, zoom, rotation, pan]);

  // Update live preview thumbnail whenever transform or aspect changes
  useEffect(() => {
    if (!imgLoaded || !isOpen) return;

    const timer = setTimeout(() => {
      const c = generateCroppedCanvas();
      if (c) {
        setPreviewDataUrl(c.toDataURL("image/jpeg", 0.85));
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [imgLoaded, isOpen, generateCroppedCanvas]);

  // Handle final crop submission
  const handleConfirmCrop = () => {
    const c = generateCroppedCanvas();
    if (!c) return;

    c.toBlob(
      (blob) => {
        if (blob) {
          const dataUrl = c.toDataURL("image/jpeg", 0.92);
          onCropComplete(blob, dataUrl);
          onClose();
        }
      },
      "image/jpeg",
      0.92
    );
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!isOpen || !imageSrc) return null;

  // Viewport crop box dimensions (calculated in CSS pixels)
  const cropBoxWidth = 240;
  const cropBoxHeight = Math.round(cropBoxWidth / selectedAspect);

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md animate-fade-in overflow-hidden overscroll-none"
      onWheel={(e) => e.stopPropagation()}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-2xl border border-hairline shadow-2xl max-w-2xl w-full flex flex-col max-h-[92vh] overflow-hidden relative"
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-hairline flex items-center justify-between bg-surface-soft/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6200]/10 text-[#FF6200] flex items-center justify-center border border-[#FF6200]/20 flex-shrink-0">
              <Crop size={20} />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-ink">{title}</h3>
              <p className="text-[11px] sm:text-xs text-muted-editorial">
                Position and frame your official face photograph for the National Cadre ID Card
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-muted-editorial hover:text-ink hover:bg-surface-soft border border-hairline transition-colors cursor-pointer flex-shrink-0"
            title="Cancel & Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div
          tabIndex={0}
          className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar overscroll-contain space-y-5 focus:outline-none"
        >
          {/* Aspect Ratio Selector Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Sliders size={13} className="text-[#FF6200]" />
                <span>Crop Framing Ratio</span>
              </span>
              <span className="text-[11px] text-[#FF6200] font-medium">
                {ASPECT_RATIOS.find((a) => a.value === selectedAspect)?.description}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ASPECT_RATIOS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedAspect(item.value)}
                  className={`text-xs py-2 px-3 rounded-xl border text-center transition-all cursor-pointer font-medium ${
                    selectedAspect === item.value
                      ? "border-[#FF6200] bg-[#FF6200]/10 text-[#FF6200] font-bold shadow-xs"
                      : "border-hairline bg-surface-soft text-muted-editorial hover:text-ink hover:bg-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Crop Canvas Viewport */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Main Interactive Stage */}
            <div className="md:col-span-8 flex flex-col items-center">
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
                className="w-full h-[280px] sm:h-[320px] bg-[#1a1816] rounded-2xl relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none border border-black/20 shadow-inner"
              >
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Transformed Image */}
                {imageSrc && (
                  <div
                    className="absolute pointer-events-none transition-transform duration-75 ease-out"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) rotate(${rotation}deg) scale(${zoom})`,
                      transformOrigin: "center center",
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt="Crop Source"
                      className="max-w-none pointer-events-none"
                      style={{
                        width: naturalSize.width ? `${cropBoxWidth}px` : "auto",
                        height: "auto",
                      }}
                      draggable={false}
                    />
                  </div>
                )}

                {/* Dark Vignette / Translucent Mask Outside Crop Box */}
                <div className="absolute inset-0 pointer-events-none bg-black/55" />

                {/* Clear Crop Aperture Window */}
                <div
                  className="relative z-10 pointer-events-none border-2 border-[#FF6200] shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] transition-all duration-200"
                  style={{
                    width: `${cropBoxWidth}px`,
                    height: `${cropBoxHeight}px`,
                    borderRadius: "8px",
                  }}
                >
                  {/* Rule-of-Thirds Grid Lines */}
                  <div className="w-full h-full relative">
                    {/* Horizontal Thirds */}
                    <div className="absolute left-0 right-0 top-1/3 border-b border-white/25" />
                    <div className="absolute left-0 right-0 top-2/3 border-b border-white/25" />
                    {/* Vertical Thirds */}
                    <div className="absolute top-0 bottom-0 left-1/3 border-r border-white/25" />
                    <div className="absolute top-0 bottom-0 left-2/3 border-r border-white/25" />

                    {/* Corner Accent Handles */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#FF6200]" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#FF6200]" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#FF6200]" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#FF6200]" />
                  </div>
                </div>

                {/* Helper overlay hint */}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] text-white/70 px-2 pointer-events-none">
                  <span className="flex items-center gap-1">
                    <Move size={11} /> Drag image to position face
                  </span>
                  <span>Scroll or pinch to zoom</span>
                </div>
              </div>

              {/* Toolbar Controls: Zoom & Rotate */}
              <div className="w-full mt-3 flex items-center justify-between gap-3 bg-surface-soft p-3 rounded-xl border border-hairline">
                {/* Zoom Controls */}
                <div className="flex items-center gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.max(z - 0.2, 0.7))}
                    className="p-1.5 rounded-lg bg-white border border-hairline text-ink hover:text-[#FF6200] transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={15} />
                  </button>

                  <input
                    type="range"
                    min="0.7"
                    max="3.0"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-[#FF6200] cursor-pointer"
                  />

                  <button
                    type="button"
                    onClick={() => setZoom((z) => Math.min(z + 0.2, 3.5))}
                    className="p-1.5 rounded-lg bg-white border border-hairline text-ink hover:text-[#FF6200] transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={15} />
                  </button>
                  <span className="text-[11px] font-mono text-muted-editorial min-w-[34px] text-right">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                <div className="h-5 w-px bg-hairline" />

                {/* Action Buttons: Rotate & Reset */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleRotate}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-hairline text-xs font-semibold text-ink hover:text-[#FF6200] flex items-center gap-1 transition-colors cursor-pointer"
                    title="Rotate 90 degrees clockwise"
                  >
                    <RotateCw size={14} />
                    <span>90°</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-1.5 rounded-lg bg-white border border-hairline text-muted-editorial hover:text-ink transition-colors cursor-pointer"
                    title="Reset position & zoom"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Live Preview Panel */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-soft/60 border border-hairline space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-editorial flex items-center gap-1">
                <Sparkles size={11} className="text-[#FF6200]" />
                <span>Live Card Preview</span>
              </span>

              {/* Circular Avatar Preview (How it appears in directory & lists) */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#FF6200] overflow-hidden shadow-md bg-white flex items-center justify-center">
                  {previewDataUrl ? (
                    <img src={previewDataUrl} alt="Circular Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={28} className="text-muted-editorial" />
                  )}
                </div>
                <span className="text-[10px] font-medium text-muted-editorial mt-1">Directory Profile</span>
              </div>

              {/* ID Card Passport Box Preview */}
              <div className="flex flex-col items-center pt-1 border-t border-hairline/80 w-full">
                <div
                  className="rounded-lg border-2 border-[#FF6200] overflow-hidden shadow-sm bg-white"
                  style={{
                    width: "72px",
                    height: `${Math.round(72 / selectedAspect)}px`,
                  }}
                >
                  {previewDataUrl ? (
                    <img src={previewDataUrl} alt="ID Box Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-card">
                      <User size={20} className="text-muted-editorial" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-medium text-muted-editorial mt-1">Official ID Card Box</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-hairline text-[10px] text-muted-editorial leading-tight">
                Align face within center grid with both eyes visible for guaranteed ID approval.
              </div>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Footer */}
        <div className="px-6 py-3.5 border-t border-hairline bg-surface-soft/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs px-4 py-2 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmCrop}
            className="btn-primary-coral text-xs px-5 py-2 flex items-center gap-1.5 shadow-sm cursor-pointer font-semibold"
          >
            <Check size={14} />
            <span>Confirm & Apply Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
