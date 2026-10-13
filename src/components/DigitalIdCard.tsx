import React, { useRef, useState, useEffect } from "react";
import { Download, ShieldCheck, User, CheckCircle2, AlertTriangle, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import { getApiUrl } from "@/config/api";

export interface DigitalIdCardProps {
  member: {
    registrationId: string;
    fullName: string;
    fatherName?: string;
    dob?: string;
    mobile?: string;
    bloodGroup?: string;
    photoUrl?: string;
    state: string;
    district: string;
    wing: string;
    profession?: string;
    createdAt?: string;
    status?: string;
  };
  qrDataUrl: string;
  customSealUrl?: string;
  customSignatureUrl?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  hideActionButtons?: boolean;
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
 * Official SVG Seal Stamp Component
 */
export const OfficialSealSvg: React.FC<{ className?: string }> = ({
  className = "w-16 h-16",
}) => (
  <svg
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={{ overflow: "visible" }}
  >
    {/* Outer decorative dashed ring */}
    <circle
      cx="80"
      cy="80"
      r="74"
      stroke="#c2410c"
      strokeWidth="2.5"
      strokeDasharray="4 2.5"
      opacity="0.95"
    />
    {/* Outer solid boundary */}
    <circle cx="80" cy="80" r="69" stroke="#c2410c" strokeWidth="2.5" opacity="0.95" />
    {/* Inner boundary */}
    <circle cx="80" cy="80" r="48" stroke="#c2410c" strokeWidth="1.5" opacity="0.95" />

    {/* Center Emblem & Text */}
    <g fill="#c2410c" textAnchor="middle">
      {/* 5-point Star */}
      <path
        d="M80 43 L82.5 49.5 L89.5 49.5 L83.8 53.5 L86 60 L80 56 L74 60 L76.2 53.5 L70.5 49.5 L77.5 49.5 Z"
        fill="#c2410c"
      />
      <text x="80" y="73" fontSize="10.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5">
        APPROVED
      </text>
      <text x="80" y="85" fontSize="8" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">
        ★ VERIFIED ★
      </text>
      <text x="80" y="96" fontSize="7" fontWeight="700" fontFamily="monospace" fill="#9a3412">
        ESTD. 1947
      </text>
    </g>

    {/* Top and Bottom Circular Text */}
    <path id="sealTopArc" d="M 22,80 A 58,58 0 0,1 138,80" fill="none" />
    <text fontSize="9" fontWeight="900" fill="#c2410c" letterSpacing="1.2">
      <textPath href="#sealTopArc" startOffset="50%" textAnchor="middle">
        MAHA SEVA DAL
      </textPath>
    </text>

    <path id="sealBottomArc" d="M 138,80 A 58,58 0 0,1 22,80" fill="none" />
    <text fontSize="7.5" fontWeight="800" fill="#c2410c" letterSpacing="0.8">
      <textPath href="#sealBottomArc" startOffset="50%" textAnchor="middle">
        CENTRAL CADRE REGISTRY
      </textPath>
    </text>
  </svg>
);

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
 * Draws the high-resolution vector official seal on HTML5 canvas
 */
const drawOfficialSeal = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(-0.1); // -6 degrees realistic ink stamp angle

  const sealColor = "#c2410c";

  // Outer dashed ring
  ctx.strokeStyle = sealColor;
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.arc(0, 0, 72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Outer solid ring
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 67, 0, Math.PI * 2);
  ctx.stroke();

  // Inner ring
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.stroke();

  // Circular text: top
  ctx.fillStyle = sealColor;
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.save();
  ctx.fillText("MAHA SEVA DAL", 0, -56);
  ctx.restore();

  // Star emblem in center
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("★", 0, -22);

  // Center bold APPROVED
  ctx.font = "900 14px sans-serif";
  ctx.fillText("APPROVED", 0, -3);

  // Center VERIFIED
  ctx.font = "bold 11px sans-serif";
  ctx.fillText("★ VERIFIED ★", 0, 15);

  // ESTD 1947
  ctx.font = "bold 10px monospace";
  ctx.fillStyle = "#7c2d12";
  ctx.fillText("ESTD. 1947", 0, 31);

  // Bottom arc text
  ctx.font = "bold 10px sans-serif";
  ctx.fillStyle = sealColor;
  ctx.fillText("OFFICIAL CADRE REGISTRY", 0, 56);

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
    "https://res.cloudinary.com/wq9znxvs/image/upload/v1785928702/msd/brand/logo.png";
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
        ctx.arc(s / 2, s / 2, s / 2 - 4, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, s, s);

        ctx.restore();
        ctx.beginPath();
        ctx.arc(s / 2, s / 2, s / 2 - 4, 0, Math.PI * 2);
        ctx.strokeStyle = "#FF6200";
        ctx.lineWidth = 8;
        ctx.stroke();

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

        // High-definition saffron border ring
        ctx.beginPath();
        ctx.arc(logoCenterX, logoCenterY, logoRadius, 0, Math.PI * 2);
        ctx.strokeStyle = "#FF6200";
        ctx.lineWidth = 3.5;
        ctx.stroke();
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
        ctx.drawImage(photoImg, 52, 277, 216, 256);
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
      ctx.fillText("ASSIGNED WING", 300, 465);
      ctx.fillStyle = "#FF6200";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText(member.wing, 300, 492);

      // Designation
      ctx.fillStyle = "#8a7e70";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("DESIGNATION / POST", 300, 525);
      ctx.fillStyle = "#1b1b1b";
      ctx.font = "18px sans-serif";
      ctx.fillText(member.profession || "Cadre Volunteer", 300, 548);

      // Jurisdiction Box
      ctx.fillStyle = "#faf5ea";
      ctx.fillRect(50, 570, 700, 155);
      ctx.strokeStyle = "#e3d7c5";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 570, 700, 155);

      // Columns
      ctx.fillStyle = "#8a7e70";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("STATE JURISDICTION", 75, 605);
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

      // Bottom Strip
      ctx.fillStyle = "#2c2824";
      ctx.fillRect(0, 1140, 800, 60);

      ctx.fillStyle = "#ffffff";
      ctx.font = "14px monospace";
      ctx.textAlign = "left";
      ctx.fillText("GOVT REG: 1947/MSD/NAT", 40, 1175);

      ctx.fillStyle = "#FF9933";
      ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("UNITY OF PEOPLE'S", 400, 1175);

      ctx.fillStyle = "#ffffff";
      ctx.font = "14px monospace";
      ctx.textAlign = "right";
      ctx.fillText(`CARD NO: ${member.registrationId.split("-").pop() || "001"}`, 760, 1175);

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
 * Direct PDF generator with centered card layout, A4 certificate header, and cut marks
 */
export const generateIdCardPdf = async (
  member: DigitalIdCardProps["member"],
  qrDataUrl: string,
  settings?: CardSettings
): Promise<void> => {
  // 1. Generate ultra-high-resolution canvas card
  const dataUrl = await generateIdCardCanvas(member, qrDataUrl, settings);
  if (!dataUrl) {
    throw new Error("Could not generate card graphic for PDF.");
  }

  // 2. Initialize A4 PDF (210 x 297 mm)
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Load brand logo circular DataURL for A4 PDF header
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

  // ─── 2. Organization Header with Official Logo & Cadre Seal ───
  // Add circular Logo on the left
  if (circularLogoDataUrl) {
    doc.addImage(circularLogoDataUrl, "PNG", 18, 9, 18, 18);
  } else {
    // Elegant fallback emblem circle
    doc.setFillColor(250, 245, 235);
    doc.circle(27, 18, 9, "F");
    doc.setDrawColor(255, 98, 0);
    doc.setLineWidth(0.5);
    doc.circle(27, 18, 9, "S");
    doc.setTextColor(255, 98, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("MSD", 27, 20.5, { align: "center" });
  }

  // Center Organization Titles
  doc.setTextColor(20, 20, 19);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("MAHA SEVA DAL", pageWidth / 2, 16.5, { align: "center" });

  doc.setTextColor(255, 98, 0); // Official BJP Saffron Orange (#FF6200)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("ESTD. 1947 · UNITY OF PEOPLE'S", pageWidth / 2, 21.5, { align: "center" });

  doc.setTextColor(115, 107, 94);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    "National Socio-Cultural Cadre Registry · Official Cadre Identity Certificate",
    pageWidth / 2,
    26,
    { align: "center" }
  );

  // Right Official Cadre Seal Badge (Symmetrical to left logo)
  const rightBadgeX = 183;
  const rightBadgeY = 18;
  doc.setFillColor(250, 245, 235);
  doc.circle(rightBadgeX, rightBadgeY, 9, "F");
  doc.setDrawColor(255, 98, 0);
  doc.setLineWidth(0.4);
  doc.circle(rightBadgeX, rightBadgeY, 9, "S");
  doc.setDrawColor(220, 210, 195);
  doc.setLineWidth(0.2);
  doc.circle(rightBadgeX, rightBadgeY, 7.8, "S");

  doc.setTextColor(255, 98, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.5);
  doc.text("ESTD", rightBadgeX, rightBadgeY - 3.2, { align: "center" });

  doc.setTextColor(20, 20, 19);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("1947", rightBadgeX, rightBadgeY + 0.8, { align: "center" });

  doc.setTextColor(19, 136, 8); // India Green
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5);
  doc.text("CADRE", rightBadgeX, rightBadgeY + 4.5, { align: "center" });

  // Thin separator line
  doc.setDrawColor(220, 210, 195);
  doc.setLineWidth(0.4);
  doc.line(18, 30.5, pageWidth - 18, 30.5);

  // ─── 3. Member Information Summary Banner ───
  doc.setFillColor(250, 245, 235);
  doc.roundedRect(20, 33, pageWidth - 40, 15, 2, 2, "F");
  doc.setDrawColor(230, 220, 205);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, 33, pageWidth - 40, 15, 2, 2, "S");

  // Summary Banner Columns
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(140, 130, 115);
  doc.text("CADRE FULL NAME", 25, 38);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(27, 27, 27);
  doc.text(member.fullName || "Cadre Member", 25, 44);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(140, 130, 115);
  doc.text("REGISTRATION ID", 90, 38);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(204, 120, 92);
  doc.text(member.registrationId || "MSD-IND-2026", 90, 44);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(140, 130, 115);
  doc.text("ASSIGNED WING", 145, 38);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(27, 27, 27);
  doc.text(member.wing || "General Cadre", 145, 44);

  // ─── 4. Centered ID Card ───
  // Card printable size = 96mm x 144mm (perfect 2:3 ratio)
  const cardW = 96;
  const cardH = 144;
  const cardX = (pageWidth - cardW) / 2; // 57mm centered
  const cardY = 54;

  // Outer dashed guideline around card
  doc.setDrawColor(180, 170, 155);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([2, 2], 0);
  doc.rect(cardX - 2.5, cardY - 2.5, cardW + 5, cardH + 5, "S");
  doc.setLineDashPattern([], 0);

  // Corner crop marks
  const markerLen = 3;
  doc.setDrawColor(120, 110, 95);
  doc.setLineWidth(0.4);
  doc.line(cardX - 4, cardY - 2.5, cardX - 4 - markerLen, cardY - 2.5);
  doc.line(cardX - 2.5, cardY - 4, cardX - 2.5, cardY - 4 - markerLen);
  doc.line(cardX + cardW + 4, cardY - 2.5, cardX + cardW + 4 + markerLen, cardY - 2.5);
  doc.line(cardX + cardW + 2.5, cardY - 4, cardX + cardW + 2.5, cardY - 4 - markerLen);
  doc.line(cardX - 4, cardY + cardH + 2.5, cardX - 4 - markerLen, cardY + cardH + 2.5);
  doc.line(cardX - 2.5, cardY + cardH + 4, cardX - 2.5, cardY + cardH + 4 - markerLen);
  doc.line(cardX + cardW + 4, cardY + cardH + 2.5, cardX + cardW + 4 + markerLen, cardY + cardH + 2.5);
  doc.line(cardX + cardW + 2.5, cardY + cardH + 4, cardX + cardW + 2.5, cardY + cardH + 4 - markerLen);

  // Add the high-resolution Card Image
  doc.addImage(dataUrl, "PNG", cardX, cardY, cardW, cardH);

  // Cut Notice below card
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(120, 110, 95);
  doc.text(
    "Cut along the dashed guideline above for standard PVC ID card holder / pouch lamination (Size: 96mm x 144mm)",
    pageWidth / 2,
    cardY + cardH + 7,
    { align: "center" }
  );

  // ─── 5. Security Verification & Footer Box ───
  const footerBoxY = 217;
  doc.setFillColor(248, 246, 240);
  doc.roundedRect(20, footerBoxY, pageWidth - 40, 52, 2, 2, "F");
  doc.setDrawColor(225, 215, 200);
  doc.setLineWidth(0.3);
  doc.roundedRect(20, footerBoxY, pageWidth - 40, 52, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(204, 120, 92);
  doc.text("VERIFICATION & SECURITY AUTHENTICATION", 25, footerBoxY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(60, 55, 50);
  doc.text(
    "1. This document serves as the official printable identity certificate of Maha Seva Dal (Estd. 1947).",
    25,
    footerBoxY + 12
  );
  doc.text(
    "2. To verify cadre authenticity in real-time, scan the QR code printed on the card with any camera smartphone.",
    25,
    footerBoxY + 17
  );
  doc.text(
    `3. Online Verification Registry URL: https://mahasevadal.com/verify?id=${member.registrationId}`,
    25,
    footerBoxY + 22
  );
  doc.text(
    "4. Official Status: " +
      ((member.status || "").toUpperCase() === "APPROVED"
        ? "APPROVED CADRE MEMBER (Digitally Sealed & Authorized)"
        : "PROVISIONAL / PENDING AUTHORIZATION"),
    25,
    footerBoxY + 27
  );
  doc.text(
    "5. For official queries, contact Central Secretariat: support@mahasevadal.com",
    25,
    footerBoxY + 32
  );

  // Signatory in footer box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(27, 27, 27);
  doc.text(settings?.signatoryName || "Authorized Signatory", pageWidth - 25, footerBoxY + 41, {
    align: "right",
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(115, 107, 94);
  doc.text(settings?.signatoryTitle || "Central Executive Committee", pageWidth - 25, footerBoxY + 45.5, {
    align: "right",
  });

  // Bottom Security Band
  doc.setFillColor(44, 40, 36);
  doc.rect(0, 287, pageWidth, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 153, 51); // Saffron
  doc.text("MAHA SEVA DAL · ESTD 1947 · UNITY OF PEOPLE'S", pageWidth / 2, 292, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(200, 200, 200);
  doc.text("GOVT REG NO: 1947/MSD/NAT · ALL RIGHTS RESERVED", pageWidth / 2, 295.5, { align: "center" });

  // 3. Save File
  doc.save(`MSD_ID_Card_${member.registrationId || "member"}.pdf`);
};

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({
  member,
  qrDataUrl,
  customSealUrl,
  customSignatureUrl,
  signatoryName,
  signatoryTitle,
  hideActionButtons = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
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

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      // Direct high-res 800x1200 canvas generator (fast, reliable, zero font or CORS glitches)
      const dataUrl = await generateIdCardCanvas(member, qrDataUrl, cardSettings);
      if (!dataUrl) {
        throw new Error("Could not render card canvas.");
      }

      // Trigger instant download
      const link = document.createElement("a");
      link.download = `MSD_ID_Card_${member.registrationId || "member"}.png`;
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
    <div className="flex flex-col items-center">
      {/* ─── PHYSICAL PVC BADGE CONTAINER ─── */}
      <div className="p-2 sm:p-4 bg-surface-soft/60 rounded-3xl border border-hairline shadow-inner max-w-full">
        <div
          ref={cardRef}
          id="msd-pvc-card"
          className="w-[340px] sm:w-[380px] bg-white rounded-2xl border-2 border-[#d5c3aa] shadow-2xl overflow-hidden relative text-ink font-sans select-none"
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
                src="https://res.cloudinary.com/wq9znxvs/image/upload/v1785928702/msd/brand/logo.png"
                alt="MSD Logo"
                crossOrigin="anonymous"
                className="w-11 h-11 rounded-full object-cover border-2 border-[#FF6200] shadow-sm flex-shrink-0"
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
          <div className="p-4 space-y-3.5 relative">
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
                {/* Verified Ribbon (only if approved) */}
                {isApproved ? (
                  <div
                    className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-sm"
                    title="Approved Official Cadre"
                  >
                    <CheckCircle2 size={14} />
                  </div>
                ) : (
                  <div
                    className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow-sm"
                    title="Pending Verification"
                  >
                    <AlertTriangle size={14} />
                  </div>
                )}
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

                <div>
                  <span className="text-[8px] text-muted-editorial uppercase font-bold tracking-wider block">
                    Designation / Role
                  </span>
                  <div className="text-[10px] font-semibold text-ink truncate">
                    {member.profession || "Cadre Member"}
                  </div>
                </div>
              </div>
            </div>

            {/* Information Grid */}
            <div className="bg-[#faf6ee] rounded-xl p-2.5 border border-[#e6dbc8] grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <span className="text-[8px] text-muted-editorial uppercase font-bold block">
                  State Jurisdiction
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
                    {/* Official Stamp */}
                    <div className="absolute right-0 top-[-6px] pointer-events-none rotate-[-6deg] drop-shadow-xs">
                      {cardSettings.customSealUrl ? (
                        <img
                          src={cardSettings.customSealUrl}
                          alt="Official Seal"
                          crossOrigin="anonymous"
                          className="w-14 h-14 object-contain"
                        />
                      ) : (
                        <OfficialSealSvg className="w-14 h-14" />
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

          {/* Bottom Security Band */}
          <div className="py-1 px-3 bg-[#3d3832] text-white flex items-center justify-between text-[7px] font-mono">
            <span>GOVT REG: 1947/MSD/NAT</span>
            <span className="text-[#FF9933] font-bold">UNITY OF PEOPLE'S</span>
            <span>CARD NO: {member.registrationId.split("-").pop() || "001"}</span>
          </div>
        </div>
      </div>

      {/* ─── ACTION BUTTONS (DOWNLOAD ONLY - PERFECTLY ALIGNED) ─── */}
      {!hideActionButtons && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-[380px] mt-5">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf || downloading}
            className="bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 transition-all cursor-pointer w-full text-center"
          >
            {downloadingPdf ? (
              <>
                <span className="animate-spin text-sm">⏳</span>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileText size={15} />
                <span>Download ID (PDF)</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={downloading || downloadingPdf}
            className="btn-primary-coral text-xs py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 transition-all cursor-pointer w-full text-center"
          >
            {downloading ? (
              <>
                <span className="animate-spin text-sm">⏳</span>
                <span>Downloading PNG...</span>
              </>
            ) : (
              <>
                <Download size={15} />
                <span>Download ID (PNG)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DigitalIdCard;
