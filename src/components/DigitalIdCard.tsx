import React, { useRef, useState, useEffect } from "react";
import {
  Download,
  ShieldCheck,
  User,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  RotateCw,
  Building2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { getApiUrl } from "@/config/api";

export interface DigitalIdCardProps {
  member: {
    registrationId: string;
    fullName: string;
    fatherName?: string;
    dob?: string;
    age?: number;
    gender?: string;
    mobile?: string;
    whatsapp?: string;
    email?: string;
    bloodGroup?: string;
    photoUrl?: string;
    state: string;
    district: string;
    taluk?: string;
    address?: string;
    pincode?: string;
    wing: string;
    profession?: string;
    createdAt?: string;
    approvedAt?: string;
    status?: string;
  };
  qrDataUrl: string;
  customSealUrl?: string;
  customSignatureUrl?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  hideActionButtons?: boolean;
  stacked?: boolean;
  defaultView?: "both" | "front" | "back";
  showViewToggle?: boolean;
}

export interface CardSettings {
  customSealUrl?: string;
  customSignatureUrl?: string;
  signatoryName?: string;
  signatoryTitle?: string;
}

/**
 * Safely load an image with explicit timeout to prevent hanging on network or CORS stalls
 */
const safeLoadImage = (src: string, timeoutMs = 2500): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (!src || src.trim().length === 0) return resolve(null);
    let done = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        resolve(null);
      }
    }, timeoutMs);

    img.onload = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve(img);
      }
    };
    img.onerror = () => {
      if (!done) {
        done = true;
        clearTimeout(timer);
        resolve(null);
      }
    };
    img.src = src;
  });
};

/**
 * Official SVG Seal Stamp Component (Realistic Blue Rubber Stamp)
 */
export const OfficialSealSvg: React.FC<{ className?: string; color?: string }> = ({
  className = "w-16 h-16",
  color = "#1d4ed8",
}) => {
  // 48 security beaded teeth along perimeter (r = 74)
  const beads = Array.from({ length: 48 }, (_, i) => {
    const angle = (i * 2 * Math.PI) / 48;
    return {
      cx: (80 + 74 * Math.cos(angle)).toFixed(2),
      cy: (80 + 74 * Math.sin(angle)).toFixed(2),
    };
  });

  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: "visible", mixBlendMode: "multiply" }}
    >
      <defs>
        {/* Top Arc for curved text */}
        <path id="sealTopArcBlue" d="M 23,80 A 57,57 0 0,1 137,80" fill="none" />
        {/* Bottom Arc for curved text */}
        <path id="sealBottomArcBlue" d="M 137,80 A 57,57 0 0,1 23,80" fill="none" />
      </defs>

      {/* 1. Outer Beaded Rim (48 security dots) */}
      <g fill={color} opacity="0.9">
        {beads.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r="1.3" />
        ))}
      </g>

      {/* 2. Outer Solid Ring */}
      <circle cx="80" cy="80" r="70" stroke={color} strokeWidth="2.4" opacity="0.95" />

      {/* 3. Outer Fine Concentric Dashed Ring */}
      <circle
        cx="80"
        cy="80"
        r="66"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="3 1.8"
        opacity="0.85"
      />

      {/* 4. Inner Boundary Double Ring */}
      <circle cx="80" cy="80" r="46" stroke={color} strokeWidth="1.8" opacity="0.95" />
      <circle cx="80" cy="80" r="42.5" stroke={color} strokeWidth="0.9" opacity="0.8" />

      {/* 5. Circular Arched Typography */}
      {/* Top Arc: MAHA SEVA DAL */}
      <text
        fontSize="9.2"
        fontWeight="900"
        fontFamily="'Arial Black', Arial, 'Helvetica Neue', sans-serif"
        fill={color}
        letterSpacing="1.4"
      >
        <textPath href="#sealTopArcBlue" startOffset="50%" textAnchor="middle">
          ★ MAHA SEVA DAL ★
        </textPath>
      </text>

      {/* Bottom Arc: AUTHORISED CADRE SEAL */}
      <text
        fontSize="7.4"
        fontWeight="800"
        fontFamily="Arial, 'Helvetica Neue', sans-serif"
        fill={color}
        letterSpacing="1.1"
      >
        <textPath href="#sealBottomArcBlue" startOffset="50%" textAnchor="middle">
          ★ AUTHORISED CADRE SEAL ★
        </textPath>
      </text>

      {/* 6. Center Emblem & Engraved Authorised Banner */}
      <g textAnchor="middle">
        {/* Triple Stars above banner */}
        <text x="80" y="58" fontSize="8" fontWeight="bold" fill="#1e3a8a">
          ★  ★  ★
        </text>

        {/* Double engraved parallel rules enclosing AUTHORISED */}
        <line x1="47" y1="64" x2="113" y2="64" stroke={color} strokeWidth="1.4" />
        <line x1="47" y1="66.5" x2="113" y2="66.5" stroke={color} strokeWidth="0.7" />

        <text
          x="80"
          y="77.5"
          fontSize="10.8"
          fontWeight="900"
          fontFamily="'Arial Black', Arial, 'Helvetica Neue', sans-serif"
          letterSpacing="1.2"
          fill="#1e3a8a"
        >
          AUTHORISED
        </text>

        <line x1="47" y1="81.5" x2="113" y2="81.5" stroke={color} strokeWidth="0.7" />
        <line x1="47" y1="84" x2="113" y2="84" stroke={color} strokeWidth="1.4" />

        {/* Subtitle badge */}
        <text
          x="80"
          y="94"
          fontSize="7.5"
          fontWeight="800"
          fontFamily="sans-serif"
          letterSpacing="0.8"
          fill={color}
        >
          ★ VERIFIED ★
        </text>

        {/* Established Year */}
        <text
          x="80"
          y="104"
          fontSize="6.8"
          fontWeight="700"
          fontFamily="'Courier New', monospace"
          letterSpacing="0.6"
          fill="#1e3a8a"
        >
          ESTD. 1947
        </text>
      </g>
    </svg>
  );
};

/**
 * Official Cursive Signature SVG
 */
export const OfficialSignatureSvg: React.FC<{ className?: string; color?: string }> = ({
  className = "h-10 w-28",
  color = "#1e3a8a",
}) => (
  <svg
    viewBox="0 0 200 65"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ overflow: "visible" }}
  >
    {/* First initial loop */}
    <path
      d="M18 45 C15 32, 22 15, 28 8 C30 6, 32 9, 29 18 C25 29, 20 48, 19 56"
      stroke={color}
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Uppercase flourish */}
    <path
      d="M20 22 C32 16, 42 12, 45 20 C47 25, 41 30, 31 33 C42 36, 52 48, 56 55"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Connecting cursive body */}
    <path
      d="M54 36 C58 32, 63 30, 67 34 C70 38, 73 35, 78 30 C82 26, 85 33, 89 31 C94 28, 98 34, 103 29 C108 24, 112 30, 116 28 C121 26, 126 31, 131 27 C138 21, 145 28, 150 25 C156 22, 162 26, 168 22"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Upper ascender flourish */}
    <path
      d="M102 30 C104 18, 107 10, 110 12 C113 14, 111 25, 109 35"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Sweeping underline flourish that touches baseline */}
    <path
      d="M25 58 C65 52, 125 50, 185 46 C192 45, 188 52, 172 55 C145 60, 95 62, 55 60"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Official 1D Barcode SVG Component for Card Back Side
 */
export const BarcodeSvg: React.FC<{ code: string; className?: string }> = ({
  code,
  className = "h-6 w-36",
}) => {
  const bars = React.useMemo(() => {
    const pattern: number[] = [2, 1, 1, 2]; // start guard
    const clean = (code || "MSD-IND-2026-0001").replace(/[^a-zA-Z0-9]/g, "");
    for (let i = 0; i < clean.length; i++) {
      const c = clean.charCodeAt(i);
      pattern.push(
        (c % 3) + 1,
        ((c >> 1) % 2) + 1,
        ((c >> 2) % 3) + 1,
        1
      );
    }
    pattern.push(2, 1, 2, 2); // stop guard
    return pattern;
  }, [code]);

  let currentX = 0;
  const elements = bars.map((w, idx) => {
    const x = currentX;
    currentX += w;
    if (idx % 2 === 0) {
      return <rect key={idx} x={x} y="0" width={w} height="28" fill="#111827" />;
    }
    return null;
  });

  return (
    <svg viewBox={`0 0 ${currentX} 28`} preserveAspectRatio="none" className={className}>
      {elements}
    </svg>
  );
};

/**
 * Draws the high-resolution vector official seal on HTML5 canvas
 * Uses authentic stamp pad blue ink and true circular curved typography
 */
const drawOfficialSeal = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(-0.1); // -6 degrees realistic hand-stamp tilt

  const primaryBlue = "#1d4ed8";
  const deepIndigo = "#1e3a8a";

  ctx.globalAlpha = 0.94;

  // 1. Outer Beaded Rim (48 perimeter dots)
  ctx.fillStyle = primaryBlue;
  for (let i = 0; i < 48; i++) {
    const ang = (i * 2 * Math.PI) / 48;
    const bx = 74 * Math.cos(ang);
    const by = 74 * Math.sin(ang);
    ctx.beginPath();
    ctx.arc(bx, by, 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Outer Solid Circle
  ctx.strokeStyle = primaryBlue;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Outer Fine Concentric Dashed Ring
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 2.5]);
  ctx.beginPath();
  ctx.arc(0, 0, 66, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // 4. Inner Boundary Double Ring
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 0.9;
  ctx.beginPath();
  ctx.arc(0, 0, 42.5, 0, Math.PI * 2);
  ctx.stroke();

  // 5. TRUE CURVED TEXT ON TOP ARC: "★ MAHA SEVA DAL ★"
  ctx.fillStyle = primaryBlue;
  ctx.font = "900 12px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const topText = "★ MAHA SEVA DAL ★";
  const topRadius = 56;
  const topSpan = 1.85; // radians span (~106°)
  const topChars = topText.length;
  for (let i = 0; i < topChars; i++) {
    const char = topText[i];
    const charAngle = -Math.PI / 2 - topSpan / 2 + (i / (topChars - 1)) * topSpan;
    const cx = topRadius * Math.cos(charAngle);
    const cy = topRadius * Math.sin(charAngle);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(charAngle + Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  // 6. TRUE CURVED TEXT ON BOTTOM ARC: "★ AUTHORISED CADRE SEAL ★"
  ctx.fillStyle = primaryBlue;
  ctx.font = "bold 9.5px Arial, sans-serif";
  const btmText = "★ AUTHORISED CADRE SEAL ★";
  const btmRadius = 56;
  const btmSpan = 2.15; // radians span (~123°)
  const btmChars = btmText.length;
  for (let i = 0; i < btmChars; i++) {
    const char = btmText[i];
    const charAngle = Math.PI / 2 + btmSpan / 2 - (i / (btmChars - 1)) * btmSpan;
    const cx = btmRadius * Math.cos(charAngle);
    const cy = btmRadius * Math.sin(charAngle);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(charAngle - Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }

  // 7. CENTER EMBLEM & BANNER
  ctx.fillStyle = deepIndigo;
  ctx.font = "bold 10px sans-serif";
  ctx.fillText("★   ★   ★", 0, -21);

  // Double horizontal engraved rules
  ctx.strokeStyle = primaryBlue;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-33, -12);
  ctx.lineTo(33, -12);
  ctx.moveTo(-33, 10.5);
  ctx.lineTo(33, 10.5);
  ctx.stroke();

  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(-33, -9.5);
  ctx.lineTo(33, -9.5);
  ctx.moveTo(-33, 8);
  ctx.lineTo(33, 8);
  ctx.stroke();

  // Bold AUTHORISED
  ctx.fillStyle = deepIndigo;
  ctx.font = "900 12.5px 'Arial Black', Arial, sans-serif";
  ctx.fillText("AUTHORISED", 0, -0.5);

  // Subtitle
  ctx.fillStyle = primaryBlue;
  ctx.font = "bold 9.5px sans-serif";
  ctx.fillText("★ VERIFIED ★", 0, 20);

  // ESTD. 1947
  ctx.fillStyle = deepIndigo;
  ctx.font = "bold 8.5px monospace";
  ctx.fillText("ESTD. 1947", 0, 31);

  ctx.restore();
};

/**
 * Draws the cursive vector signature directly on HTML5 canvas
 */
const drawVectorSignature = (ctx: CanvasRenderingContext2D, startX: number, startY: number, color = "#1e3a8a") => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Initial flourish
  ctx.beginPath();
  ctx.moveTo(startX + 18, startY + 45);
  ctx.bezierCurveTo(startX + 15, startY + 32, startX + 22, startY + 15, startX + 28, startY + 8);
  ctx.bezierCurveTo(startX + 30, startY + 6, startX + 32, startY + 9, startX + 29, startY + 18);
  ctx.bezierCurveTo(startX + 25, startY + 29, startX + 20, startY + 48, startX + 19, startY + 56);
  ctx.stroke();

  // Cross stroke / loop
  ctx.beginPath();
  ctx.moveTo(startX + 20, startY + 22);
  ctx.bezierCurveTo(startX + 32, startY + 16, startX + 42, startY + 12, startX + 45, startY + 20);
  ctx.bezierCurveTo(startX + 47, startY + 25, startX + 41, startY + 30, startX + 31, startY + 33);
  ctx.bezierCurveTo(startX + 42, startY + 36, startX + 52, startY + 48, startX + 56, startY + 55);
  ctx.stroke();

  // Cursive word body
  ctx.beginPath();
  ctx.lineWidth = 2.8;
  ctx.moveTo(startX + 54, startY + 36);
  ctx.bezierCurveTo(startX + 58, startY + 32, startX + 63, startY + 30, startX + 67, startY + 34);
  ctx.bezierCurveTo(startX + 70, startY + 38, startX + 73, startY + 35, startX + 78, startY + 30);
  ctx.bezierCurveTo(startX + 82, startY + 26, startX + 85, startY + 33, startX + 89, startY + 31);
  ctx.bezierCurveTo(startX + 94, startY + 28, startX + 98, startY + 34, startX + 103, startY + 29);
  ctx.bezierCurveTo(startX + 108, startY + 24, startX + 112, startY + 30, startX + 116, startY + 28);
  ctx.bezierCurveTo(startX + 121, startY + 26, startX + 126, startY + 31, startX + 131, startY + 27);
  ctx.bezierCurveTo(startX + 138, startY + 21, startX + 145, startY + 28, startX + 150, startY + 25);
  ctx.bezierCurveTo(startX + 156, startY + 22, startX + 162, startY + 26, startX + 168, startY + 22);
  ctx.stroke();

  // Upper loop
  ctx.beginPath();
  ctx.moveTo(startX + 102, startY + 30);
  ctx.bezierCurveTo(startX + 104, startY + 18, startX + 107, startY + 10, startX + 110, startY + 12);
  ctx.bezierCurveTo(startX + 113, startY + 14, startX + 111, startY + 25, startX + 109, startY + 35);
  ctx.stroke();

  // Sweeping underline flourish
  ctx.beginPath();
  ctx.lineWidth = 2.4;
  ctx.moveTo(startX + 25, startY + 58);
  ctx.bezierCurveTo(startX + 65, startY + 52, startX + 125, startY + 50, startX + 185, startY + 46);
  ctx.bezierCurveTo(startX + 192, startY + 45, startX + 188, startY + 52, startX + 172, startY + 55);
  ctx.bezierCurveTo(startX + 145, startY + 60, startX + 95, startY + 62, startX + 55, startY + 60);
  ctx.stroke();

  ctx.restore();
};

/**
 * Safely resolve brand logo image and generate high-res circular DataURL
 */
const resolveBrandLogo = async (): Promise<{
  img: HTMLImageElement | null;
  circularDataUrl: string;
}> => {
  const brandLogoUrl =
    "https://res.cloudinary.com/wq9znxvs/image/upload/v1792229405/msd/brand/logo.png";
  let proxyLogoUrl = brandLogoUrl;
  if (proxyLogoUrl.startsWith("http") && !proxyLogoUrl.includes("/api/members/proxy-photo")) {
    proxyLogoUrl = getApiUrl(
      `/api/members/proxy-photo?url=${encodeURIComponent(brandLogoUrl)}`
    );
  }
  let img = await safeLoadImage(proxyLogoUrl, 2500);
  if (!img) {
    img = await safeLoadImage(brandLogoUrl, 2000);
  }

  let circularDataUrl = "";
  if (img && img.width > 0) {
    try {
      const c = document.createElement("canvas");
      const s = 240;
      c.width = s;
      c.height = s;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, s, s);

        circularDataUrl = c.toDataURL("image/png");
      }
    } catch (e) {
      console.warn("Could not create circular logo DataURL:", e);
    }
  }

  return { img, circularDataUrl };
};

/**
 * Direct HTML5 Canvas generator for 100% reliable, zero-CORS-failure ID card downloads (800x1200px)
 */
export const generateIdCardCanvas = async (
  member: DigitalIdCardProps["member"],
  qrDataUrl: string,
  settings?: CardSettings
): Promise<string> => {
  try {
    const isApproved = (member.status || "").toUpperCase() === "APPROVED";

    // 1. Resolve QR code image safely
    let qrImg: HTMLImageElement | null = null;
    if (qrDataUrl) {
      qrImg = await safeLoadImage(qrDataUrl, 2000);
    }

    // 2. Resolve Member Photo safely via proxy to eliminate cross-origin taint
    let photoImg: HTMLImageElement | null = null;
    if (member.photoUrl) {
      let loadUrl = member.photoUrl;
      if (loadUrl.startsWith("http") && !loadUrl.includes("/api/members/proxy-photo")) {
        loadUrl = getApiUrl(`/api/members/proxy-photo?url=${encodeURIComponent(member.photoUrl)}`);
      }
      photoImg = await safeLoadImage(loadUrl, 2500);

      // If proxy failed, try direct URL
      if (!photoImg && member.photoUrl !== loadUrl) {
        photoImg = await safeLoadImage(member.photoUrl, 2000);
      }
    }

    // 3. Resolve Custom Seal Image (if configured)
    let sealImg: HTMLImageElement | null = null;
    if (isApproved && settings?.customSealUrl) {
      let loadSealUrl = settings.customSealUrl;
      if (loadSealUrl.startsWith("http") && !loadSealUrl.includes("/api/members/proxy-photo")) {
        loadSealUrl = getApiUrl(`/api/members/proxy-photo?url=${encodeURIComponent(settings.customSealUrl)}`);
      }
      sealImg = await safeLoadImage(loadSealUrl, 2000);
      if (!sealImg && settings.customSealUrl !== loadSealUrl) {
        sealImg = await safeLoadImage(settings.customSealUrl, 2000);
      }
    }

    // 4. Resolve Custom Signature Image (if configured)
    let sigImg: HTMLImageElement | null = null;
    if (isApproved && settings?.customSignatureUrl) {
      let loadSigUrl = settings.customSignatureUrl;
      if (loadSigUrl.startsWith("http") && !loadSigUrl.includes("/api/members/proxy-photo")) {
        loadSigUrl = getApiUrl(`/api/members/proxy-photo?url=${encodeURIComponent(settings.customSignatureUrl)}`);
      }
      sigImg = await safeLoadImage(loadSigUrl, 2000);
      if (!sigImg && settings.customSignatureUrl !== loadSigUrl) {
        sigImg = await safeLoadImage(settings.customSignatureUrl, 2000);
      }
    }

    // 5. Resolve Official Organization Logo
    const { img: logoImg } = await resolveBrandLogo();

    // Function to render card on canvas
    const drawCard = (includePhoto: boolean): string => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (!ctx) return "";

      // 1. Background
      const bgGrad = ctx.createLinearGradient(0, 0, 800, 1200);
      bgGrad.addColorStop(0, "#ffffff");
      bgGrad.addColorStop(0.5, "#faf7f0");
      bgGrad.addColorStop(1, "#f3ebe0");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 1200);

      // Card Outer Border
      ctx.strokeStyle = "#FF6200";
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, 792, 1192);

      // 2. Lanyard Slot
      ctx.fillStyle = "#faf5ea";
      ctx.fillRect(8, 8, 784, 50);
      ctx.fillStyle = "#4a443c";
      ctx.beginPath();
      ctx.arc(330, 28, 10, Math.PI / 2, (Math.PI * 3) / 2);
      ctx.arc(470, 28, 10, (Math.PI * 3) / 2, Math.PI / 2);
      ctx.closePath();
      ctx.fill();

      // 3. Indian National Tricolor Ribbon
      ctx.fillStyle = "#FF6200";
      ctx.fillRect(0, 58, 800, 10);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 68, 800, 6);
      ctx.fillStyle = "#138808";
      ctx.fillRect(0, 74, 800, 10);

      // 4. Header Bar
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 84, 800, 131);

      // Subtle warm gradient behind header
      const headerGrad = ctx.createLinearGradient(0, 84, 0, 215);
      headerGrad.addColorStop(0, "#ffffff");
      headerGrad.addColorStop(1, "#faf6ef");
      ctx.fillStyle = headerGrad;
      ctx.fillRect(0, 84, 800, 131);

      // Header bottom border
      ctx.fillStyle = "#e8ddcb";
      ctx.fillRect(0, 214, 800, 1);

      // ─── 4A. Left Brand Logo ───
      const logoCenterX = 90;
      const logoCenterY = 149;
      const logoRadius = 45;

      if (logoImg && logoImg.width > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(logoCenterX, logoCenterY, logoRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(
          logoImg,
          logoCenterX - logoRadius,
          logoCenterY - logoRadius,
          logoRadius * 2,
          logoRadius * 2
        );
        ctx.restore();
      } else {
        // High-fidelity vector fallback logo
        ctx.beginPath();
        ctx.arc(logoCenterX, logoCenterY, logoRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#faf3ee";
        ctx.fill();
        ctx.strokeStyle = "#FF6200";
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.fillStyle = "#FF6200";
        ctx.font = "bold 20px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("MSD", logoCenterX, logoCenterY + 7);
      }

      // ─── 4B. Center Titles & Motto ───
      ctx.textAlign = "center";
      ctx.fillStyle = "#141413";
      ctx.font = "bold 34px Georgia, serif";
      ctx.fillText("MAHA SEVA DAL", 400, 135);

      ctx.fillStyle = "#FF6200";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("ESTD. 1947 · UNITY OF PEOPLE'S", 400, 165);

      ctx.fillStyle = "#736b5e";
      ctx.font = "13px sans-serif";
      ctx.fillText("National Socio-Cultural Cadre Registry", 400, 191);

      // ─── 4C. Right Official 1947 Emblem Badge ───
      const emblemCenterX = 710;
      const emblemCenterY = 149;
      const emblemRadius = 42;

      // Outer circle
      ctx.beginPath();
      ctx.arc(emblemCenterX, emblemCenterY, emblemRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#faf5ea";
      ctx.fill();
      ctx.strokeStyle = "#e8d2be";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Inner saffron ring
      ctx.beginPath();
      ctx.arc(emblemCenterX, emblemCenterY, emblemRadius - 4, 0, Math.PI * 2);
      ctx.strokeStyle = "#FF6200";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Badge texts
      ctx.fillStyle = "#FF6200";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("ESTD", emblemCenterX, emblemCenterY - 14);

      ctx.fillStyle = "#141413";
      ctx.font = "bold 17px Georgia, serif";
      ctx.fillText("1947", emblemCenterX, emblemCenterY + 4);

      ctx.fillStyle = "#138808";
      ctx.font = "bold 8.5px sans-serif";
      ctx.fillText("CADRE", emblemCenterX, emblemCenterY + 17);

      // ─── 4D. Title Banner ───
      ctx.fillStyle = "#FF6200";
      ctx.fillRect(60, 222, 680, 36);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("OFFICIAL NATIONAL CADRE IDENTITY CARD", 400, 246);

      // Photo Frame
      ctx.fillStyle = "#f5efe6";
      ctx.strokeStyle = "#FF6200";
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 275, 220, 260);
      ctx.fillRect(52, 277, 216, 256);

      if (includePhoto && photoImg && photoImg.width > 0) {
        // Center-crop (object-fit: cover) so square photos never stretch or distort
        const frameW = 216;
        const frameH = 256;
        const imgRatio = photoImg.width / photoImg.height;
        const frameRatio = frameW / frameH;
        let sx = 0;
        let sy = 0;
        let sw = photoImg.width;
        let sh = photoImg.height;

        if (imgRatio > frameRatio) {
          sw = photoImg.height * frameRatio;
          sx = (photoImg.width - sw) / 2;
        } else {
          sh = photoImg.width / frameRatio;
          sy = (photoImg.height - sh) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(52, 277, frameW, frameH);
        ctx.clip();
        ctx.drawImage(photoImg, sx, sy, sw, sh, 52, 277, frameW, frameH);
        ctx.restore();
      } else {
        // Placeholder Avatar
        ctx.fillStyle = "#faede3";
        ctx.fillRect(52, 277, 216, 256);
        ctx.fillStyle = "#FF6200";
        ctx.font = "bold 96px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText((member.fullName || "M").charAt(0).toUpperCase(), 160, 420);
        ctx.font = "bold 13px sans-serif";
        ctx.fillStyle = "#8a7e70";
        ctx.fillText("CADRE MEMBER", 160, 470);
      }

      // Details Block
      ctx.textAlign = "left";

      // Full Name
      ctx.fillStyle = "#8a7e70";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("CADRE FULL NAME", 300, 305);
      ctx.fillStyle = "#1b1b1b";
      ctx.font = "bold 30px Georgia, serif";
      ctx.fillText(member.fullName, 300, 340);

      // Registration ID
      ctx.fillStyle = "#8a7e70";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("REGISTRATION ID", 300, 385);
      ctx.fillStyle = "#faede3";
      ctx.fillRect(300, 395, 380, 40);
      ctx.strokeStyle = "#e8d2be";
      ctx.lineWidth = 2;
      ctx.strokeRect(300, 395, 380, 40);
      ctx.fillStyle = "#FF6200";
      ctx.font = "bold 22px monospace";
      ctx.fillText(member.registrationId, 315, 423);

      // Assigned Wing
      ctx.fillStyle = "#8a7e70";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("ASSIGNED WING", 300, 475);
      ctx.fillStyle = "#FF6200";
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(member.wing, 300, 508);

      // Jurisdiction Box
      ctx.fillStyle = "#faf5ea";
      ctx.fillRect(50, 570, 700, 155);
      ctx.strokeStyle = "#e3d7c5";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 570, 700, 155);

      // Columns
      ctx.fillStyle = "#8a7e70";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("STATE UNIT", 75, 605);
      ctx.fillStyle = "#1b1b1b";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(member.state, 75, 635);

      ctx.fillStyle = "#8a7e70";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("DISTRICT UNIT", 420, 605);
      ctx.fillStyle = "#1b1b1b";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(member.district, 420, 635);

      ctx.fillStyle = "#8a7e70";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("CONTACT MOBILE", 75, 675);
      ctx.fillStyle = "#1b1b1b";
      ctx.font = "bold 18px monospace";
      ctx.fillText(member.mobile || "—", 75, 703);

      ctx.fillStyle = "#8a7e70";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("BLOOD GROUP", 420, 675);
      ctx.fillStyle = "#be123c";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(member.bloodGroup || "Not Specified", 420, 703);

      // Security QR Code
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(50, 750, 210, 210);
      ctx.strokeStyle = "#e3d7c5";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 750, 210, 210);

      if (qrImg && qrImg.width > 0) {
        ctx.drawImage(qrImg, 60, 760, 190, 190);
      } else {
        ctx.fillStyle = "#8a7e70";
        ctx.font = "14px monospace";
        ctx.textAlign = "center";
        ctx.fillText("QR VERIFIED", 155, 855);
      }

      ctx.textAlign = "left";
      ctx.fillStyle = "#FF6200";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("SCAN TO VERIFY", 285, 820);
      ctx.fillStyle = "#736b5e";
      ctx.font = "15px sans-serif";
      ctx.fillText("Official Cadre Registry", 285, 848);
      ctx.font = "14px monospace";
      ctx.fillText("mahasevadal.com", 285, 873);

      // ─── SEAL & SIGNATURE SECTION ─────────────────────────────
      if (isApproved) {
        // 1. Official Seal Stamp
        if (sealImg && sealImg.width > 0) {
          ctx.save();
          ctx.translate(635, 850);
          ctx.rotate(-0.08);
          ctx.drawImage(sealImg, -70, -70, 140, 140);
          ctx.restore();
        } else {
          drawOfficialSeal(ctx, 635, 850);
        }

        // 2. Official Authorized Signature (positioned naturally above the line)
        if (sigImg && sigImg.width > 0) {
          ctx.drawImage(sigImg, 510, 915, 180, 68);
        } else {
          drawVectorSignature(ctx, 490, 915, "#1e3a8a");
        }

        // 3. Signatory Line
        ctx.strokeStyle = "#1b1b1b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(470, 985);
        ctx.lineTo(750, 985);
        ctx.stroke();

        ctx.fillStyle = "#1b1b1b";
        ctx.font = "bold 15px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(settings?.signatoryName || "Authorized Signatory", 610, 1010);
        ctx.font = "12px sans-serif";
        ctx.fillStyle = "#736b5e";
        ctx.fillText(settings?.signatoryTitle || "Central Executive Committee", 610, 1030);
      } else {
        // PROVISIONAL / PENDING APPROVAL INDICATOR
        ctx.save();
        ctx.translate(620, 860);
        ctx.rotate(-0.05);

        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, 65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#b45309";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("MAHA SEVA DAL", 0, -22);
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("PROVISIONAL", 0, 2);
        ctx.font = "bold 10px monospace";
        ctx.fillText("PENDING SANCTION", 0, 24);
        ctx.restore();

        // Signatory Line (dashed)
        ctx.strokeStyle = "#a8a29e";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(480, 985);
        ctx.lineTo(750, 985);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#78716c";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Verification In Progress", 615, 1010);
        ctx.font = "11px sans-serif";
        ctx.fillText("Awaiting Committee Approval", 615, 1030);

        // Watermark across center
        ctx.save();
        ctx.translate(400, 620);
        ctx.rotate(-0.38);
        ctx.fillStyle = "rgba(217, 119, 6, 0.16)";
        ctx.font = "bold 44px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("PROVISIONAL · PENDING APPROVAL", 0, 0);
        ctx.restore();
      }

      // Bottom Strip (Only Saffron Text)
      ctx.fillStyle = "#2c2824";
      ctx.fillRect(0, 1140, 800, 60);

      ctx.fillStyle = "#FF9933";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("UNITY OF PEOPLE'S", 400, 1175);

      return canvas.toDataURL("image/png");
    };

    // First attempt: draw with photo (clean via proxy)
    try {
      const dataUrl = drawCard(true);
      if (dataUrl && dataUrl.length > 500) {
        return dataUrl;
      }
    } catch (taintErr) {
      console.warn("Canvas tainted by photo, falling back to clean avatar card:", taintErr);
    }

    // Guaranteed fallback: draw with avatar (never tainted)
    return drawCard(false);
  } catch (err) {
    console.error("generateIdCardCanvas error:", err);
    return "";
  }
};

/**
 * Clean & Simple PDF generator:
 * - Single-page dual-sided layout (Front & Back side-by-side like PNG format)
 * - Standard 70 mm × 100 mm physical dimensions with crop marks and center fold guideline
 * - Simple, uncluttered presentation without extra paragraphs
 */
export const generateIdCardPdf = async (
  member: DigitalIdCardProps["member"],
  qrDataUrl: string,
  settings?: CardSettings
): Promise<void> => {
  // 1. Generate ultra-high-resolution canvas cards for BOTH Front and Back sides
  const [dataUrl, backDataUrl] = await Promise.all([
    generateIdCardCanvas(member, qrDataUrl, settings),
    generateIdCardBackCanvas(member),
  ]);

  if (!dataUrl) {
    throw new Error("Could not generate card graphic for PDF.");
  }

  // 2. Initialize A4 PDF (210 x 297 mm) - Clean Single Page Layout
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Load brand logo circular DataURL for PDF header
  let circularLogoDataUrl = "";
  try {
    const logoData = await resolveBrandLogo();
    circularLogoDataUrl = logoData.circularDataUrl;
  } catch (logoErr) {
    console.warn("Could not load logo for PDF header:", logoErr);
  }

  // ─── 1. Tricolor Top Ribbon ───
  doc.setFillColor(255, 98, 0); // Saffron
  doc.rect(0, 0, pageWidth, 2.5, "F");
  doc.setFillColor(255, 255, 255); // White
  doc.rect(0, 2.5, pageWidth, 1.5, "F");
  doc.setFillColor(19, 136, 8); // Green
  doc.rect(0, 4, pageWidth, 2.5, "F");

  // ─── 2. Clean Header Bar ───
  if (circularLogoDataUrl) {
    doc.addImage(circularLogoDataUrl, "PNG", 18, 9, 16, 16);
  } else {
    doc.setFillColor(250, 245, 235);
    doc.circle(26, 17, 8, "F");
    doc.setDrawColor(255, 98, 0);
    doc.setLineWidth(0.5);
    doc.circle(26, 17, 8, "S");
    doc.setTextColor(255, 98, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("MSD", 26, 19.5, { align: "center" });
  }

  // Center Organization Titles
  doc.setTextColor(20, 20, 19);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("MAHA SEVA DAL", pageWidth / 2, 16, { align: "center" });

  doc.setTextColor(255, 98, 0); // Official Saffron
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("OFFICIAL CADRE PVC IDENTITY CARD", pageWidth / 2, 21, { align: "center" });

  doc.setTextColor(115, 107, 94);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "ESTD. 1947 · UNITY OF PEOPLE'S · DUAL-SIDED PRINT SPECIFICATION (70 mm × 100 mm)",
    pageWidth / 2,
    25.5,
    { align: "center" }
  );

  // Right Official Cadre Seal Badge
  const rightBadgeX = 184;
  const rightBadgeY = 17;
  doc.setFillColor(250, 245, 235);
  doc.circle(rightBadgeX, rightBadgeY, 8, "F");
  doc.setDrawColor(255, 98, 0);
  doc.setLineWidth(0.4);
  doc.circle(rightBadgeX, rightBadgeY, 8, "S");
  doc.setDrawColor(220, 210, 195);
  doc.setLineWidth(0.2);
  doc.circle(rightBadgeX, rightBadgeY, 6.8, "S");

  doc.setTextColor(255, 98, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5);
  doc.text("ESTD", rightBadgeX, rightBadgeY - 2.8, { align: "center" });

  doc.setTextColor(20, 20, 19);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.text("1947", rightBadgeX, rightBadgeY + 0.8, { align: "center" });

  doc.setTextColor(19, 136, 8);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(4.5);
  doc.text("CADRE", rightBadgeX, rightBadgeY + 4, { align: "center" });

  // Thin separator line
  doc.setDrawColor(220, 210, 195);
  doc.setLineWidth(0.4);
  doc.line(18, 29, pageWidth - 18, 29);

  // ─── 3. Dual-Sided ID Cards (Side-by-Side - Exact Clean PNG Layout) ───
  // Card dimensions: 70mm x 100mm (Standard universal PVC pouch size)
  const cardW = 70;
  const cardH = 100;
  const frontCardX = 30;
  const backCardX = 110;
  const divideX = 105;
  const badgeY = 40;
  const cardY = 47;

  // Front Side Badge
  doc.setFillColor(255, 243, 229);
  doc.roundedRect(frontCardX, badgeY, cardW, 5.5, 1, 1, "F");
  doc.setDrawColor(255, 98, 0);
  doc.setLineWidth(0.3);
  doc.roundedRect(frontCardX, badgeY, cardW, 5.5, 1, 1, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 98, 0);
  doc.text("FRONT SIDE", frontCardX + cardW / 2, badgeY + 3.8, {
    align: "center",
  });

  // Back Side Badge
  doc.setFillColor(250, 246, 238);
  doc.roundedRect(backCardX, badgeY, cardW, 5.5, 1, 1, "F");
  doc.setDrawColor(61, 56, 50);
  doc.setLineWidth(0.3);
  doc.roundedRect(backCardX, badgeY, cardW, 5.5, 1, 1, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(44, 40, 36);
  doc.text("BACK SIDE", backCardX + cardW / 2, badgeY + 3.8, {
    align: "center",
  });

  // Outer dashed guidelines around each card
  doc.setDrawColor(180, 170, 155);
  doc.setLineWidth(0.25);
  doc.setLineDashPattern([2, 2], 0);
  doc.rect(frontCardX - 1.5, cardY - 1.5, cardW + 3, cardH + 3, "S");
  doc.rect(backCardX - 1.5, cardY - 1.5, cardW + 3, cardH + 3, "S");

  // Center vertical cutting & folding line
  doc.setDrawColor(150, 140, 125);
  doc.setLineWidth(0.35);
  doc.line(divideX, badgeY, divideX, cardY + cardH + 4);
  doc.setLineDashPattern([], 0);

  // Scissor cut / fold icons
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  doc.setTextColor(140, 130, 115);
  doc.text("✂ CUT / FOLD", divideX, badgeY - 1.2, { align: "center" });
  doc.text("✂ FOLD", divideX, cardY + cardH + 7, { align: "center" });

  // Corner crop marks for Front & Back Cards
  const markerLen = 3;
  doc.setDrawColor(120, 110, 95);
  doc.setLineWidth(0.35);
  // Top-left front
  doc.line(frontCardX - 3.5, cardY - 1.5, frontCardX - 3.5 - markerLen, cardY - 1.5);
  doc.line(frontCardX - 1.5, cardY - 3.5, frontCardX - 1.5, cardY - 3.5 - markerLen);
  // Bottom-left front
  doc.line(frontCardX - 3.5, cardY + cardH + 1.5, frontCardX - 3.5 - markerLen, cardY + cardH + 1.5);
  doc.line(frontCardX - 1.5, cardY + cardH + 3.5, frontCardX - 1.5, cardY + cardH + 3.5 + markerLen);
  // Top-right back
  doc.line(backCardX + cardW + 3.5, cardY - 1.5, backCardX + cardW + 3.5 + markerLen, cardY - 1.5);
  doc.line(backCardX + cardW + 1.5, cardY - 3.5, backCardX + cardW + 1.5, cardY - 3.5 - markerLen);
  // Bottom-right back
  doc.line(backCardX + cardW + 3.5, cardY + cardH + 1.5, backCardX + cardW + 3.5 + markerLen, cardY + cardH + 1.5);
  doc.line(backCardX + cardW + 1.5, cardY + cardH + 3.5, backCardX + cardW + 1.5, cardY + cardH + 3.5 + markerLen);

  // Add the high-resolution Front Card Image
  doc.addImage(dataUrl, "PNG", frontCardX, cardY, cardW, cardH);

  // Add the high-resolution Back Card Image side-by-side
  if (backDataUrl) {
    doc.addImage(backDataUrl, "PNG", backCardX, cardY, cardW, cardH);
  }

  // 1-Line Clean Cutting & Pouch Note below cards (NO extra paragraphs)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(115, 107, 94);
  doc.text(
    "✂ Cut along outer crop marks · Fold along center dashed line for standard PVC ID card pouch (70 mm × 100 mm / 2.63\" × 3.88\")",
    pageWidth / 2,
    cardY + cardH + 8,
    { align: "center" }
  );

  // ─── 4. Simple Member & Authorization Row (Clean, No Paragraphs) ───
  const infoY = cardY + cardH + 18;
  doc.setFillColor(250, 247, 240);
  doc.roundedRect(25, infoY, pageWidth - 50, 24, 2, 2, "F");
  doc.setDrawColor(225, 215, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(25, infoY, pageWidth - 50, 24, 2, 2, "S");

  // Left Column: Cadre Member Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(140, 130, 115);
  doc.text("CADRE MEMBER:", 32, infoY + 7);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(27, 27, 27);
  doc.text(member.fullName || "Cadre Member", 32, infoY + 13);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(115, 107, 94);
  doc.text(`ID: ${member.registrationId || "MSD-IND"} · Wing: ${member.wing || "General Cadre"}`, 32, infoY + 18.5);

  // Right Column: Signatory
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(140, 130, 115);
  doc.text("AUTHORIZED SIGNATORY:", pageWidth - 32, infoY + 7, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(27, 27, 27);
  doc.text(settings?.signatoryName || "Authorized Signatory", pageWidth - 32, infoY + 13, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(115, 107, 94);
  doc.text(settings?.signatoryTitle || "Central Executive Committee", pageWidth - 32, infoY + 18.5, { align: "right" });

  // ─── 5. Bottom Security Band ───
  doc.setFillColor(44, 40, 36);
  doc.rect(0, 286, pageWidth, 11, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(255, 153, 51); // Saffron
  doc.text("MAHA SEVA DAL · ESTD 1947 · UNITY OF PEOPLE'S", pageWidth / 2, 291.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(200, 200, 200);
  doc.text(
    "DISCIPLINE · SERVICE · UNITY · GOVT REG NO: 1947/MSD/NAT · ALL RIGHTS RESERVED",
    pageWidth / 2,
    295,
    { align: "center" }
  );

  // ─── 6. Save File ───
  doc.save(`MSD_ID_Card_${member.registrationId || "member"}.pdf`);
};

/**
 * Helper to safely format gender to Male / Female / Other
 */
const getDisplayGender = (gender?: string): string => {
  if (!gender || typeof gender !== "string" || !gender.trim()) return "Male";
  const lower = gender.trim().toLowerCase();
  if (lower === "male" || lower === "m") return "Male";
  if (lower === "female" || lower === "f") return "Female";
  if (lower === "other" || lower === "o") return "Other";
  return gender.trim().charAt(0).toUpperCase() + gender.trim().slice(1);
};

/**
 * Direct HTML5 Canvas generator for Back Side of ID Card (800x1200px)
 */
export const generateIdCardBackCanvas = async (
  member: DigitalIdCardProps["member"]
): Promise<string> => {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 800, 1200);
    bgGrad.addColorStop(0, "#ffffff");
    bgGrad.addColorStop(0.5, "#faf7f0");
    bgGrad.addColorStop(1, "#f3ebe0");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1200);

    // Outer Border
    ctx.strokeStyle = "#FF6200";
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, 792, 1192);

    // 2. Lanyard Slot
    ctx.fillStyle = "#faf5ea";
    ctx.fillRect(8, 8, 784, 50);
    ctx.fillStyle = "#4a443c";
    ctx.beginPath();
    ctx.arc(330, 28, 10, Math.PI / 2, (Math.PI * 3) / 2);
    ctx.arc(470, 28, 10, (Math.PI * 3) / 2, Math.PI / 2);
    ctx.closePath();
    ctx.fill();

    // 3. Indian National Tricolor Ribbon
    const triGrad = ctx.createLinearGradient(8, 0, 792, 0);
    triGrad.addColorStop(0, "#FF6200");
    triGrad.addColorStop(0.48, "#ffffff");
    triGrad.addColorStop(1, "#138808");
    ctx.fillStyle = triGrad;
    ctx.fillRect(8, 58, 784, 18);

    // 4. Header Bar
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(8, 76, 784, 110);
    ctx.strokeStyle = "#e8ddcb";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 76, 784, 110);

    // Logo
    const { img: logoImg } = await resolveBrandLogo();
    if (logoImg) {
      const bLogoCenterX = 35 + 75 / 2;
      const bLogoCenterY = 92 + 75 / 2;
      const bLogoRadius = 75 / 2;
      ctx.save();
      ctx.beginPath();
      ctx.arc(bLogoCenterX, bLogoCenterY, bLogoRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(logoImg, 35, 92, 75, 75);
      ctx.restore();
    }

    // Header Titles
    ctx.fillStyle = "#1e1e1e";
    ctx.font = "bold 32px Georgia, serif";
    ctx.fillText("MAHA SEVA DAL", 130, 125);

    ctx.fillStyle = "#FF6200";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.fillText("CADRE PARTICULARS & VERIFICATION", 130, 150);

    ctx.fillStyle = "#777064";
    ctx.font = "12px Arial, sans-serif";
    ctx.fillText("National Socio-Cultural Cadre Registry · Estd. 1947", 130, 170);

    // Badge: REVERSE SIDE
    ctx.fillStyle = "#fff4e5";
    ctx.fillRect(645, 110, 120, 30);
    ctx.strokeStyle = "#FF6200";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(645, 110, 120, 30);
    ctx.fillStyle = "#FF6200";
    ctx.font = "bold 12px Courier, monospace";
    ctx.fillText("CARD BACK", 665, 130);

    // 5. Section 1: Member Personal & Family Particulars (Card Box)
    ctx.fillStyle = "#faf6ee";
    ctx.fillRect(35, 210, 730, 200);
    ctx.strokeStyle = "#e6dbc8";
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 210, 730, 200);

    // Father's Name
    ctx.fillStyle = "#8a8174";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText("FATHER'S / HUSBAND'S NAME", 60, 245);
    ctx.fillStyle = "#1e1e1e";
    ctx.font = "bold 20px Georgia, serif";
    ctx.fillText(member.fatherName ? `Sh. ${member.fatherName}` : "—", 60, 275);

    // DOB & Age
    ctx.fillStyle = "#8a8174";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText("DATE OF BIRTH & AGE", 430, 245);
    ctx.fillStyle = "#1e1e1e";
    ctx.font = "bold 19px Courier, monospace";
    const dobStr = member.dob ? `${member.dob}${member.age ? ` (${member.age} Yrs)` : ""}` : "—";
    ctx.fillText(dobStr, 430, 275);

    // Divider line
    ctx.strokeStyle = "#e8dfcf";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(60, 310);
    ctx.lineTo(735, 310);
    ctx.stroke();

    // Gender
    ctx.fillStyle = "#8a8174";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText("GENDER", 60, 345);
    ctx.fillStyle = "#1e1e1e";
    ctx.font = "bold 18px Arial, sans-serif";
    ctx.fillText(getDisplayGender(member.gender), 60, 375);

    // Emergency / Mobile
    ctx.fillStyle = "#8a8174";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText("EMERGENCY / WHATSAPP", 430, 345);
    ctx.fillStyle = "#1e1e1e";
    ctx.font = "bold 18px Courier, monospace";
    ctx.fillText(member.whatsapp || member.mobile || "—", 430, 375);

    // 6. Section 2: Permanent Residential Address
    ctx.fillStyle = "#faf6ee";
    ctx.fillRect(35, 435, 730, 220);
    ctx.strokeStyle = "#e6dbc8";
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 435, 730, 220);

    ctx.fillStyle = "#FF6200";
    ctx.font = "bold 14px Arial, sans-serif";
    ctx.fillText("📍 PERMANENT RESIDENTIAL ADDRESS", 60, 470);

    ctx.fillStyle = "#1e1e1e";
    ctx.font = "500 18px Arial, sans-serif";
    const addr = member.address || "Permanent Registered Address on Record";
    const words = addr.split(" ");
    let line1 = "";
    let line2 = "";
    for (const w of words) {
      if ((line1 + w).length < 48) line1 += w + " ";
      else line2 += w + " ";
    }
    ctx.fillText(line1.trim(), 60, 505);
    if (line2.trim()) {
      ctx.fillText(line2.trim(), 60, 535);
    }

    // Taluk, District, State, PIN
    ctx.fillStyle = "#4a443c";
    ctx.font = "bold 16px Arial, sans-serif";
    const geoStr = [
      member.taluk ? `Taluk: ${member.taluk}` : "",
      `District: ${member.district}`,
      `State: ${member.state}`,
      member.pincode ? `PIN: ${member.pincode}` : "",
    ]
      .filter(Boolean)
      .join("  |  ");
    ctx.fillText(geoStr, 60, 580);

    ctx.fillStyle = "#6b6255";
    ctx.font = "14px Arial, sans-serif";
    ctx.fillText(`Registered Email: ${member.email || "mahasevadalorganization@gmail.com"}`, 60, 620);

    // 7. Section 3: Official Cadre Guidelines & Terms
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(35, 680, 730, 250);
    ctx.strokeStyle = "#e6dbc8";
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 680, 730, 250);

    ctx.fillStyle = "#1e1e1e";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.fillText("🛡️ OFFICIAL CADRE GUIDELINES & DIRECTIVES", 60, 720);

    ctx.fillStyle = "#554e44";
    ctx.font = "14.5px Arial, sans-serif";
    const bullets = [
      "• This Identity Card is non-transferable property of Maha Seva Dal (Estd. 1947).",
      "• The accredited holder is pledged to constitutional unity, discipline & civic welfare.",
      "• Authorized for social mobilization, disaster response, and developmental camps.",
      "• Card validity is subject to active cadre compliance & continuous renewal.",
      "• If found unattended, please deposit at the nearest post box or return to Central HQ.",
    ];
    bullets.forEach((b, idx) => {
      ctx.fillText(b, 60, 760 + idx * 32);
    });

    // 8. Section 4: 1D Barcode & Validity Row
    ctx.fillStyle = "#faf6ee";
    ctx.fillRect(35, 955, 730, 160);
    ctx.strokeStyle = "#e6dbc8";
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 955, 730, 160);

    // Draw Barcode on left
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(60, 975, 340, 75);
    ctx.strokeStyle = "#d6caba";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(60, 975, 340, 75);

    ctx.fillStyle = "#111827";
    const regId = member.registrationId || "MSD-IND-2026-0001";
    let bx = 75;
    for (let i = 0; i < regId.length; i++) {
      const code = regId.charCodeAt(i);
      const w1 = (code % 3) + 1.5;
      const w2 = ((code >> 1) % 3) + 1.5;
      ctx.fillRect(bx, 985, w1, 40);
      bx += w1 + ((code >> 2) % 2 + 1.5);
      ctx.fillRect(bx, 985, w2, 40);
      bx += w2 + 2.5;
    }

    ctx.fillStyle = "#333333";
    ctx.font = "bold 13px Courier, monospace";
    ctx.fillText(regId, 130, 1042);

    // Validity & Issuance Details on right
    const rawDate = member.approvedAt || member.createdAt || new Date().toISOString();
    const issueDate = new Date(rawDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const expDate = new Date(
      new Date(rawDate).setFullYear(new Date(rawDate).getFullYear() + 5)
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    ctx.fillStyle = "#777064";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText("DATE OF ISSUE:", 430, 995);
    ctx.fillStyle = "#1e1e1e";
    ctx.font = "bold 15px Courier, monospace";
    ctx.fillText(issueDate, 560, 995);

    ctx.fillStyle = "#777064";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.fillText("VALID UNTIL:", 430, 1030);
    ctx.fillStyle = "#138808";
    ctx.font = "bold 15px Courier, monospace";
    ctx.fillText(`${expDate} (5 YRS)`, 560, 1030);

    ctx.fillStyle = "#FF6200";
    ctx.font = "bold 12.5px Arial, sans-serif";
    ctx.fillText("CENTRAL EXECUTIVE COMMITTEE", 430, 1065);

    // 9. Bottom Dark Security Band (Only Saffron Text)
    ctx.fillStyle = "#2c2824";
    ctx.fillRect(8, 1140, 784, 52);

    ctx.fillStyle = "#FF9933";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DISCIPLINE · SERVICE · UNITY", 400, 1172);

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Back Canvas Generation Error:", err);
    return "";
  }
};

/**
 * Direct HTML5 Canvas generator for Combined Both Sides (Front + Back) on a single high-res print sheet
 */
export const generateCombinedIdCardCanvas = async (
  member: DigitalIdCardProps["member"],
  qrDataUrl: string,
  settings?: CardSettings
): Promise<string> => {
  try {
    const [frontDataUrl, backDataUrl] = await Promise.all([
      generateIdCardCanvas(member, qrDataUrl, settings),
      generateIdCardBackCanvas(member),
    ]);

    if (!frontDataUrl || !backDataUrl) {
      throw new Error("Failed to render front or back card canvas");
    }

    const [frontImg, backImg] = await Promise.all([
      safeLoadImage(frontDataUrl),
      safeLoadImage(backDataUrl),
    ]);

    if (!frontImg || !backImg) {
      throw new Error("Failed to load front or back card image");
    }

    const canvas = document.createElement("canvas");
    // Sheet dimensions: Two 800x1200 cards side-by-side with 80px middle gap, 40px margins
    const width = 1760;
    const height = 1410;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    // 1. Studio Print Background (Ivory paper certificate gradient)
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#ffffff");
    bgGrad.addColorStop(0.5, "#faf7f0");
    bgGrad.addColorStop(1, "#f4ede0");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative outer border
    ctx.strokeStyle = "#FF6200";
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, width - 12, height - 12);
    ctx.strokeStyle = "#d6c5ad";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    // 2. Top Header Bar
    ctx.fillStyle = "#2c2824";
    ctx.fillRect(15, 15, width - 30, 60);

    // Header Titles
    ctx.fillStyle = "#FF9933";
    ctx.font = "bold 22px Georgia, serif";
    ctx.textAlign = "left";
    ctx.fillText("MAHA SEVA DAL · OFFICIAL CADRE PVC IDENTITY CARD", 40, 52);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("DUAL-SIDED PRINT SPECIFICATION (70 mm × 100 mm / 2.63\" × 3.88\") · ESTD 1947", width - 40, 51);

    // 3. Side Labels & Badges
    const cardY = 85;
    const frontX = 40;
    const backX = 920;

    // Front Side Badge
    ctx.fillStyle = "#fff3e5";
    ctx.fillRect(frontX, cardY, 800, 36);
    ctx.strokeStyle = "#FF6200";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(frontX, cardY, 800, 36);
    ctx.fillStyle = "#FF6200";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("FRONT SIDE", frontX + 400, cardY + 24);

    // Back Side Badge
    ctx.fillStyle = "#faf6ee";
    ctx.fillRect(backX, cardY, 800, 36);
    ctx.strokeStyle = "#3d3832";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(backX, cardY, 800, 36);
    ctx.fillStyle = "#2c2824";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("BACK SIDE", backX + 400, cardY + 24);

    // 4. Draw Cards (at full native 800x1200 resolution)
    const cardImgY = 130;
    ctx.drawImage(frontImg, frontX, cardImgY, 800, 1200);
    ctx.drawImage(backImg, backX, cardImgY, 800, 1200);

    // 5. Center Cutting & Folding Dashed Guide
    const divideX = 880;
    ctx.save();
    ctx.strokeStyle = "#8a7e70";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(divideX, cardY);
    ctx.lineTo(divideX, cardImgY + 1200);
    ctx.stroke();
    ctx.restore();

    // Center Vertical Guide Notice
    ctx.save();
    ctx.translate(divideX, (cardImgY + 1200) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = "#776b5d";
    ctx.font = "bold 12px Courier, monospace";
    ctx.textAlign = "center";
    ctx.fillText("✂ CUT / FOLD ALONG THIS LINE FOR DOUBLE-SIDED CARD HOLDER ✂", 0, -6);
    ctx.restore();

    // 6. Bottom Security Band (Only Saffron Text)
    const footerY = cardImgY + 1210;
    ctx.fillStyle = "#2c2824";
    ctx.fillRect(15, footerY, width - 30, 48);

    ctx.fillStyle = "#FF9933";
    ctx.font = "bold 15px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("DISCIPLINE · SERVICE · UNITY", width / 2, footerY + 29);

    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Combined Canvas Generation Error:", err);
    return "";
  }
};

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  member,
  qrDataUrl,
  customSealUrl,
  customSignatureUrl,
  signatoryName,
  signatoryTitle,
  hideActionButtons = false,
  stacked = false,
  defaultView = "both",
  showViewToggle = false,
}) => {
  const [activeView, setActiveView] = useState<"both" | "front" | "back">(defaultView);
  const [downloading, setDownloading] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  // Local card settings state, initialized from props or localStorage
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    customSealUrl: customSealUrl || localStorage.getItem("msd_seal_image_url") || "",
    customSignatureUrl: customSignatureUrl || localStorage.getItem("msd_signature_image_url") || "",
    signatoryName: signatoryName || localStorage.getItem("msd_signatory_name") || "Authorized Signatory",
    signatoryTitle: signatoryTitle || localStorage.getItem("msd_signatory_title") || "Central Executive Committee",
  });

  // Fetch settings from API on mount
  useEffect(() => {
    fetch(getApiUrl("/api/members/card-settings"))
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings) {
          setCardSettings((prev) => ({
            customSealUrl: customSealUrl || data.settings.customSealUrl || prev.customSealUrl,
            customSignatureUrl: customSignatureUrl || data.settings.customSignatureUrl || prev.customSignatureUrl,
            signatoryName: signatoryName || data.settings.signatoryName || prev.signatoryName,
            signatoryTitle: signatoryTitle || data.settings.signatoryTitle || prev.signatoryTitle,
          }));
        }
      })
      .catch(() => {});
  }, [customSealUrl, customSignatureUrl, signatoryName, signatoryTitle]);

  const isApproved = (member.status || "").toUpperCase() === "APPROVED";

  const rawDate = member.approvedAt || member.createdAt || new Date().toISOString();
  const issueDate = new Date(rawDate).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const validUntilDate = new Date(
    new Date(rawDate).setFullYear(new Date(rawDate).getFullYear() + 5)
  ).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleDownloadImage = async (mode: "both" | "front" | "back" = "both") => {
    setDownloading(true);
    try {
      let dataUrl = "";
      let filenameSuffix = "BothSides";

      if (mode === "front") {
        dataUrl = await generateIdCardCanvas(member, qrDataUrl, cardSettings);
        filenameSuffix = "Front";
      } else if (mode === "back") {
        dataUrl = await generateIdCardBackCanvas(member);
        filenameSuffix = "Back";
      } else {
        dataUrl = await generateCombinedIdCardCanvas(member, qrDataUrl, cardSettings);
        filenameSuffix = "BothSides";
      }

      if (!dataUrl) {
        throw new Error("Could not render card canvas.");
      }

      const link = document.createElement("a");
      link.download = `MSD_ID_Card_${filenameSuffix}_${member.registrationId || "member"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      console.error("Download error:", err);
      alert("Download error: " + (err.message || "Failed to download card"));
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      await generateIdCardPdf(member, qrDataUrl, cardSettings);
    } catch (err: any) {
      console.error("PDF download error:", err);
      alert("PDF download failed: " + (err.message || "Unknown error"));
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* ─── SIDE SELECTOR (WHEN ENABLED) ─── */}
      {showViewToggle && (
        <div className="flex items-center justify-center gap-1 mb-3.5 bg-surface-soft p-1 rounded-2xl border border-hairline shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveView("front")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === "front"
                ? "bg-[#FF6200] text-white shadow-xs"
                : "text-muted-editorial hover:text-ink hover:bg-white/60"
            }`}
          >
            Front Side
          </button>
          <button
            type="button"
            onClick={() => setActiveView("back")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === "back"
                ? "bg-[#FF6200] text-white shadow-xs"
                : "text-muted-editorial hover:text-ink hover:bg-white/60"
            }`}
          >
            Back Side
          </button>
          <button
            type="button"
            onClick={() => setActiveView("both")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === "both"
                ? "bg-[#FF6200] text-white shadow-xs"
                : "text-muted-editorial hover:text-ink hover:bg-white/60"
            }`}
          >
            Both Sides
          </button>
        </div>
      )}

      {/* ─── CARDS CONTAINER ─── */}
      <div
        className={`flex ${
          stacked ? "flex-col" : "flex-col lg:flex-row"
        } items-stretch justify-center gap-6 lg:gap-8 max-w-full w-full`}
      >
        {/* ══════════════ 1. FRONT SIDE ══════════════ */}
        {(activeView === "both" || activeView === "front") && (
          <div className="flex flex-col items-center flex-1 max-w-[394px]">
          {/* Front Header Badge */}
          <div className="flex items-center justify-center gap-1.5 w-[min(330px,calc(100vw-36px))] sm:w-[370px] px-3.5 py-1.5 mb-2.5 bg-[#FF6200]/10 border border-[#FF6200]/25 rounded-xl text-xs font-bold text-[#FF6200] shadow-2xs">
            <ShieldCheck size={14} />
            <span>FRONT SIDE</span>
          </div>

          {/* Physical PVC Card Container - Front */}
          <div className="p-2 sm:p-3 bg-surface-soft/60 rounded-3xl border border-hairline shadow-inner max-w-full h-full flex flex-col justify-center">
            <div
              id="msd-pvc-card-front"
              className="w-[min(330px,calc(100vw-36px))] sm:w-[370px] h-[530px] sm:h-[560px] flex flex-col justify-between bg-white rounded-2xl border-2 border-[#d5c3aa] shadow-xl overflow-hidden relative text-ink font-sans select-none"
              style={{
                backgroundImage:
                  "radial-gradient(#faf7ee 1px, transparent 1px), linear-gradient(135deg, #ffffff 0%, #faf8f2 50%, #f4ede0 100%)",
                backgroundSize: "20px 20px, 100% 100%",
              }}
            >
              {/* Lanyard Punch Slot Simulation */}
              <div className="pt-2 pb-1 flex justify-center items-center bg-[#faf6ee] border-b border-[#e9dfce]">
                <div className="w-14 h-2.5 rounded-full bg-[#3d3832]/20 border border-[#3d3832]/30 shadow-inner" />
              </div>

              {/* Indian National Tricolor Ribbon */}
              <div className="h-2 w-full bg-gradient-to-r from-[#FF6200] via-[#FFFFFF] to-[#138808] border-b border-[#e5d8c3]" />

              {/* Card Header */}
              <div className="px-4 pt-3 pb-2 border-b border-[#e8ddcb] bg-gradient-to-b from-white to-[#faf6ef]">
                <div className="flex items-center justify-between gap-2">
                  <img
                    src="https://res.cloudinary.com/wq9znxvs/image/upload/v1792229405/msd/brand/logo.png"
                    alt="MSD Logo"
                    crossOrigin="anonymous"
                    className="w-11 h-11 rounded-full object-contain shadow-xs flex-shrink-0"
                  />
                  <div className="text-center flex-1">
                    <div className="font-serif font-black text-base tracking-tight text-ink uppercase leading-none">
                      Maha Seva Dal
                    </div>
                    <div className="text-[9px] font-sans font-bold text-[#FF6200] tracking-widest uppercase mt-0.5">
                      Estd. 1947 · Unity of People's
                    </div>
                    <div className="text-[8px] text-muted-editorial font-medium">
                      National Socio-Cultural Cadre Registry
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[#FF6200]/10 border border-[#FF6200]/30 flex flex-col items-center justify-center text-center flex-shrink-0">
                    <ShieldCheck size={16} className="text-[#FF6200]" />
                    <span className="text-[6px] font-mono font-bold text-[#FF6200]">1947</span>
                  </div>
                </div>

                {/* Official Badge Title Bar */}
                <div className="mt-2 py-0.5 px-2 bg-gradient-to-r from-[#FF6200] to-[#D65000] rounded text-center shadow-xs">
                  <span className="text-[9px] font-bold text-white tracking-wider uppercase font-sans">
                    Official National Cadre Identity Card
                  </span>
                </div>
              </div>

              {/* Card Body Profile Section */}
              <div className="p-3.5 sm:p-4 space-y-3 relative flex-1 flex flex-col justify-between">
                {/* Watermark when not approved */}
                {!isApproved && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
                    <div className="transform -rotate-25 border-2 border-dashed border-amber-600/50 text-amber-800/40 font-mono font-black text-xl px-4 py-1.5 uppercase tracking-widest select-none bg-amber-50/20 rounded-lg">
                      PROVISIONAL · PENDING
                    </div>
                  </div>
                )}

                {/* Top Row: Photo & Core Identifiers */}
                <div className="flex items-start gap-3.5">
                  {/* Photo Box */}
                  <div className="relative flex-shrink-0">
                    <div className="w-[100px] h-[120px] rounded-lg overflow-hidden border-2 border-[#FF6200] bg-surface-soft shadow-md flex items-center justify-center">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.fullName}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-editorial">
                          <User size={38} className="text-[#FF6200]" />
                          <span className="text-[8px] mt-1 font-mono uppercase">Member</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Identity Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div>
                      <span className="text-[8px] text-muted-editorial uppercase font-bold tracking-wider block">
                        Cadre Full Name
                      </span>
                      <div className="font-serif font-black text-sm text-ink leading-tight truncate">
                        {member.fullName}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] text-muted-editorial uppercase font-bold tracking-wider block">
                        Registration ID
                      </span>
                      <div className="font-mono text-xs font-bold text-[#FF6200] bg-surface-soft px-2 py-0.5 rounded border border-[#e5dac8] inline-block shadow-2xs">
                        {member.registrationId}
                      </div>
                    </div>

                    <div>
                      <span className="text-[8px] text-muted-editorial uppercase font-bold tracking-wider block">
                        Assigned Wing
                      </span>
                      <div className="text-[10px] font-bold text-ink bg-[#FF6200]/10 text-[#FF6200] px-2 py-0.5 rounded-md border border-[#FF6200]/25 inline-block">
                        {member.wing}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Information Grid */}
                <div className="bg-[#faf6ee] rounded-xl p-2.5 border border-[#e6dbc8] grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-[8px] text-muted-editorial uppercase font-bold block">
                      State Unit
                    </span>
                    <span className="font-bold text-ink truncate block">{member.state}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-muted-editorial uppercase font-bold block">
                      District Unit
                    </span>
                    <span className="font-bold text-ink truncate block">{member.district}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-muted-editorial uppercase font-bold block">
                      Contact Mobile
                    </span>
                    <span className="font-mono font-semibold text-ink block">{member.mobile || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-muted-editorial uppercase font-bold block">
                      Blood Group
                    </span>
                    <span className="font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 inline-block">
                      {member.bloodGroup || "O+"}
                    </span>
                  </div>
                </div>

                {/* Security QR Code & Official Signatory Seal Row */}
                <div className="flex items-center justify-between pt-1 border-t border-[#e8dfcf]">
                  {/* QR Code Container */}
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-16 bg-white p-0.5 rounded-lg border border-[#e3d7c5] shadow-xs flex items-center justify-center">
                      {qrDataUrl ? (
                        <img src={qrDataUrl} alt="Verify QR" className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-[8px] text-center text-muted-editorial font-mono">QR</div>
                      )}
                    </div>
                    <div className="text-[8px] leading-tight text-muted-editorial">
                      <div className="font-bold text-[#FF6200]">SCAN TO VERIFY</div>
                      <div>Official Cadre</div>
                      <div className="font-mono text-[7px]">mahasevadal.com</div>
                    </div>
                  </div>

                  {/* Authorized Seal & Stamp & Signature Container */}
                  {isApproved ? (
                    <div className="relative flex flex-col items-end min-w-[130px]">
                      {/* Seal and Signature Overlap Zone */}
                      <div className="relative w-32 h-14 flex items-center justify-end">
                        {/* Official Stamp (Authentic Blue Stamped Seal) */}
                        <div
                          className="absolute right-[-4px] top-[-8px] pointer-events-none rotate-[-6deg] drop-shadow-xs"
                          style={{ mixBlendMode: "multiply" }}
                        >
                          {cardSettings.customSealUrl ? (
                            <img
                              src={cardSettings.customSealUrl}
                              alt="Official Seal"
                              crossOrigin="anonymous"
                              className="w-[58px] h-[58px] object-contain"
                            />
                          ) : (
                            <OfficialSealSvg className="w-[58px] h-[58px]" />
                          )}
                        </div>

                        {/* Flowing Authorized Signature */}
                        <div className="absolute right-2 bottom-[-2px] z-10 pointer-events-none">
                          {cardSettings.customSignatureUrl ? (
                            <img
                              src={cardSettings.customSignatureUrl}
                              alt="Authorized Signature"
                              crossOrigin="anonymous"
                              className="h-9 max-w-[110px] object-contain drop-shadow-xs"
                            />
                          ) : (
                            <OfficialSignatureSvg className="h-9 w-24 text-blue-900" />
                          )}
                        </div>
                      </div>

                      {/* Signatory Underline & Designation */}
                      <div className="mt-0.5 border-t-2 border-ink/80 w-28 text-right pt-0.5">
                        <span className="text-[7.5px] font-bold text-ink uppercase tracking-wider block leading-tight">
                          {cardSettings.signatoryName || "Authorized Signatory"}
                        </span>
                        <span className="text-[6px] text-muted-editorial block leading-tight">
                          {cardSettings.signatoryTitle || "Central Executive Committee"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Provisional Unapproved Indicator */
                    <div className="text-right flex flex-col items-end min-w-[120px]">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-amber-600/70 flex flex-col items-center justify-center text-center p-0.5 rotate-[-4deg] bg-amber-50/60">
                        <span className="text-[5px] font-black uppercase text-amber-800 leading-tight">
                          MAHA SEVA DAL
                        </span>
                        <span className="text-[6px] font-black uppercase text-amber-700">PROVISIONAL</span>
                        <span className="text-[4.5px] font-mono text-amber-800 leading-tight">PENDING APPROVAL</span>
                      </div>
                      <div className="mt-1 border-t border-dashed border-ink/30 w-24 text-right pt-0.5">
                        <span className="text-[7px] font-bold text-muted-editorial uppercase tracking-wider block">
                          Pending Sanction
                        </span>
                        <span className="text-[5.5px] text-muted-editorial block">Awaiting Committee</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Security Band (Only Saffron Text) */}
              <div className="py-1.5 px-3 bg-[#3d3832] flex items-center justify-center text-center text-[7.5px] font-mono">
                <span className="text-[#FF9933] font-bold tracking-widest uppercase">
                  UNITY OF PEOPLE'S
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* ══════════════ 2. BACK SIDE ══════════════ */}
        {(activeView === "both" || activeView === "back") && (
          <div className="flex flex-col items-center flex-1 max-w-[394px]">
          {/* Back Header Badge */}
          <div className="flex items-center justify-center gap-1.5 w-[min(330px,calc(100vw-36px))] sm:w-[370px] px-3.5 py-1.5 mb-2.5 bg-[#FF6200]/10 border border-[#FF6200]/25 rounded-xl text-xs font-bold text-[#FF6200] shadow-2xs">
            <FileText size={14} />
            <span>BACK SIDE</span>
          </div>

          {/* Physical PVC Card Container - Back */}
          <div className="p-2 sm:p-3 bg-surface-soft/60 rounded-3xl border border-hairline shadow-inner max-w-full h-full flex flex-col justify-center">
            <div
              id="msd-pvc-card-back"
              className="w-[min(330px,calc(100vw-36px))] sm:w-[370px] h-[530px] sm:h-[560px] flex flex-col justify-between bg-white rounded-2xl border-2 border-[#d5c3aa] shadow-xl overflow-hidden relative text-ink font-sans select-none"
              style={{
                backgroundImage:
                  "radial-gradient(#faf7ee 1px, transparent 1px), linear-gradient(135deg, #ffffff 0%, #faf8f2 50%, #f4ede0 100%)",
                backgroundSize: "20px 20px, 100% 100%",
              }}
            >
              {/* Lanyard Punch Slot Simulation */}
              <div className="pt-2 pb-1 flex justify-center items-center bg-[#faf6ee] border-b border-[#e9dfce]">
                <div className="w-14 h-2.5 rounded-full bg-[#3d3832]/20 border border-[#3d3832]/30 shadow-inner" />
              </div>

              {/* Indian National Tricolor Ribbon */}
              <div className="h-2 w-full bg-gradient-to-r from-[#FF6200] via-[#FFFFFF] to-[#138808] border-b border-[#e5d8c3]" />

              {/* Back Header */}
              <div className="px-4 pt-3 pb-2 border-b border-[#e8ddcb] bg-gradient-to-b from-white to-[#faf6ef]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://res.cloudinary.com/wq9znxvs/image/upload/v1792229405/msd/brand/logo.png"
                      alt="MSD Logo"
                      crossOrigin="anonymous"
                      className="w-9 h-9 rounded-full object-contain shadow-xs flex-shrink-0"
                    />
                    <div>
                      <div className="font-serif font-black text-sm tracking-tight text-ink uppercase leading-none">
                        Maha Seva Dal
                      </div>
                      <div className="text-[8.5px] font-sans font-bold text-[#FF6200] tracking-wider uppercase mt-0.5">
                        Cadre Particulars & Verification
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-[#FF6200]/10 border border-[#FF6200]/30 text-[8px] font-mono font-bold text-[#FF6200] uppercase tracking-wider">
                    Reverse Side
                  </div>
                </div>

                <div className="mt-2 py-0.5 px-2 bg-[#2c2824] rounded text-center shadow-xs">
                  <span className="text-[8px] font-bold text-[#FF9933] tracking-widest uppercase font-mono">
                    Official Cadre Record & Directives
                  </span>
                </div>
              </div>

              {/* Back Content Body */}
              <div className="p-3.5 space-y-2.5 text-ink flex-1 flex flex-col justify-between">
                {/* 1. Family & Personal Particulars Box */}
                <div className="bg-[#faf6ee] rounded-xl p-2.5 border border-[#e6dbc8] space-y-1.5 text-[9.5px]">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[7.5px] text-muted-editorial uppercase font-bold block">
                        Father's / Husband's Name
                      </span>
                      <span className="font-bold text-ink truncate block">
                        {member.fatherName ? `Sh. ${member.fatherName}` : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-muted-editorial uppercase font-bold block">
                        Date of Birth & Age
                      </span>
                      <span className="font-bold text-ink block font-mono">
                        {member.dob ? `${member.dob}${member.age ? ` (${member.age} Yrs)` : ""}` : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-[#ede3d3]">
                    <div>
                      <span className="text-[7.5px] text-muted-editorial uppercase font-bold block">
                        Gender
                      </span>
                      <span className="font-semibold text-ink block">
                        {getDisplayGender(member.gender)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-muted-editorial uppercase font-bold block">
                        Emergency / WhatsApp
                      </span>
                      <span className="font-mono font-semibold text-ink block">
                        {member.whatsapp || member.mobile || "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Permanent Residential Address Box */}
                <div className="bg-[#faf6ee] rounded-xl p-2.5 border border-[#e6dbc8]">
                  <div className="flex items-center gap-1.5 mb-1 text-[#FF6200]">
                    <MapPin size={11} className="flex-shrink-0" />
                    <span className="text-[7.5px] text-muted-editorial uppercase font-bold tracking-wider">
                      Permanent Residential Address
                    </span>
                  </div>
                  <p className="text-[9px] text-ink font-medium leading-relaxed">
                    {member.address || "Permanent Registered Address on Record"}
                  </p>
                  <div className="text-[8px] text-muted-editorial font-semibold mt-1.5 flex flex-wrap gap-x-2 pt-1 border-t border-[#ede3d3]">
                    {member.taluk && <span>Taluk: {member.taluk}</span>}
                    <span>Dist: {member.district}</span>
                    <span>State: {member.state}</span>
                    {member.pincode && (
                      <span className="font-mono text-[#FF6200] font-bold">PIN: {member.pincode}</span>
                    )}
                  </div>
                  {member.email && (
                    <div className="text-[7.5px] text-muted-editorial mt-1">
                      Email: <span className="font-mono text-ink">{member.email}</span>
                    </div>
                  )}
                </div>

                {/* 3. Official Terms & Directives */}
                <div className="p-2 bg-white/70 rounded-lg border border-[#e8dfcf] space-y-1 text-[7.5px] text-muted-editorial leading-tight">
                  <div className="font-bold text-ink uppercase text-[7.5px] flex items-center gap-1">
                    <ShieldCheck size={11} className="text-emerald-600 flex-shrink-0" />
                    <span>Cadre Directives & Terms</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[7px]">
                    <li>This card is non-transferable property of Maha Seva Dal (Estd. 1947).</li>
                    <li>Authorized for civic welfare, social upliftment & relief operations.</li>
                    <li>If found, please return to Central Secretariat or nearest post box.</li>
                  </ul>
                </div>

                {/* 4. 1D Barcode & Validity Row */}
                <div className="flex items-center justify-between pt-1 border-t border-[#e8dfcf] text-[8px]">
                  <div>
                    <div className="bg-white px-2 py-0.5 rounded border border-[#e5dac8] shadow-2xs inline-block">
                      <BarcodeSvg code={member.registrationId} className="h-6 w-32" />
                    </div>
                    <div className="font-mono text-[7px] text-muted-editorial font-bold mt-0.5">
                      REG: {member.registrationId}
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="text-[7px] text-muted-editorial">
                      ISSUED: <span className="font-mono font-bold text-ink">{issueDate}</span>
                    </div>
                    <div className="text-[7px] text-muted-editorial">
                      VALID THRU: <span className="font-mono font-bold text-emerald-700">{validUntilDate}</span>
                    </div>
                    <div className="text-[6.5px] font-bold text-[#FF6200] uppercase tracking-tight">
                      Central Exec. Committee
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Security Band (Only Saffron Text) */}
              <div className="py-1.5 px-3 bg-[#3d3832] flex items-center justify-center text-center text-[7.5px] font-mono">
                <span className="text-[#FF9933] font-bold tracking-widest uppercase">
                  DISCIPLINE · SERVICE · UNITY
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ─── ACTION BUTTONS (DOWNLOAD PDF & IMAGES) ─── */}
      {!hideActionButtons && (
        <div className="flex flex-col gap-3 w-full max-w-xl mt-6">
          {/* Card Dimensions Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-editorial bg-[#faf7ee] px-4 py-2 rounded-xl border border-[#e5dac8] shadow-2xs">
            <span className="font-bold text-[#FF6200]">Card Dimensions:</span>
            <span className="font-mono font-bold text-ink">70 mm × 100 mm (2.63" × 3.88")</span>
            <span className="text-muted-editorial/40">•</span>
            <span className="text-[11px]">Standard PVC ID Holder & Lamination Pouch Size</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* 1. Download PDF (Both Sides) */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || downloading}
              className="bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs sm:text-sm py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer w-full text-center"
              title="Download official 1-page PDF certificate with Front & Back sides side-by-side"
            >
              {downloadingPdf ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileText size={16} />
                  <span>Download PDF (Both Sides)</span>
                </>
              )}
            </button>

            {/* 2. Download PNG (Both Sides) */}
            <button
              onClick={() => handleDownloadImage("both")}
              disabled={downloading || downloadingPdf}
              className="btn-primary-coral text-xs sm:text-sm py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer w-full text-center"
              title="Download high-resolution image showing both Front and Back sides side-by-side"
            >
              {downloading ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  <span>Saving Image...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Download PNG (Both Sides)</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Single Side PNG Downloads */}
          <div className="flex items-center justify-center gap-3 text-xs text-muted-editorial pt-1 border-t border-hairline/60">
            <span>Single Side PNG:</span>
            <button
              type="button"
              onClick={() => handleDownloadImage("front")}
              disabled={downloading || downloadingPdf}
              className="text-[#FF6200] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              <span>Front Side Only</span>
            </button>
            <span className="text-muted-editorial/40">•</span>
            <button
              type="button"
              onClick={() => handleDownloadImage("back")}
              disabled={downloading || downloadingPdf}
              className="text-[#FF6200] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              <span>Back Side Only</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalIdCard;
