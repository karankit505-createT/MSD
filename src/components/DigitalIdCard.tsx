import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Printer, ShieldCheck, User, CheckCircle2 } from "lucide-react";
import { getApiUrl } from "@/config/api";

interface DigitalIdCardProps {
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
 * Direct HTML5 Canvas generator for 100% reliable, zero-CORS-failure ID card downloads (800x1200px)
 */
export const generateIdCardCanvas = async (
  member: DigitalIdCardProps["member"],
  qrDataUrl: string
): Promise<string> => {
  try {
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
      ctx.strokeStyle = "#cc785c";
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
      ctx.fillRect(0, 84, 800, 145);

      // Title & Motto
      ctx.fillStyle = "#1b1b1b";
      ctx.font = "bold 38px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText("MAHA SEVA DAL", 400, 140);

      ctx.fillStyle = "#cc785c";
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("ESTD. 1947 · UNITY OF PEOPLE'S", 400, 170);

      ctx.fillStyle = "#736b5e";
      ctx.font = "14px sans-serif";
      ctx.fillText("National Socio-Cultural Cadre Registry", 400, 195);

      // Title Banner
      ctx.fillStyle = "#cc785c";
      ctx.fillRect(80, 215, 640, 36);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("OFFICIAL NATIONAL CADRE IDENTITY CARD", 400, 239);

      // Photo Frame
      ctx.fillStyle = "#f5efe6";
      ctx.strokeStyle = "#cc785c";
      ctx.lineWidth = 4;
      ctx.strokeRect(50, 275, 220, 260);
      ctx.fillRect(52, 277, 216, 256);

      if (includePhoto && photoImg && photoImg.width > 0) {
        ctx.drawImage(photoImg, 52, 277, 216, 256);
      } else {
        // Placeholder Avatar
        ctx.fillStyle = "#faede3";
        ctx.fillRect(52, 277, 216, 256);
        ctx.fillStyle = "#cc785c";
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
      ctx.fillStyle = "#cc785c";
      ctx.font = "bold 22px monospace";
      ctx.fillText(member.registrationId, 315, 423);

      // Assigned Wing
      ctx.fillStyle = "#8a7e70";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("ASSIGNED WING", 300, 465);
      ctx.fillStyle = "#cc785c";
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
      ctx.fillStyle = "#cc785c";
      ctx.font = "bold 18px sans-serif";
      ctx.fillText("SCAN TO VERIFY", 285, 820);
      ctx.fillStyle = "#736b5e";
      ctx.font = "15px sans-serif";
      ctx.fillText("Official Cadre Registry", 285, 848);
      ctx.font = "14px monospace";
      ctx.fillText("mahasevadal.org", 285, 873);

      // Official Seal on Right
      ctx.save();
      ctx.translate(620, 845);
      ctx.rotate(-0.08);
      ctx.strokeStyle = "#cc785c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 64, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#cc785c";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("MAHA SEVA DAL", 0, -25);
      ctx.font = "bold 15px sans-serif";
      ctx.fillStyle = "#1b1b1b";
      ctx.fillText("★ OFFICIAL ★", 0, 4);
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = "#cc785c";
      ctx.fillText("VERIFIED 1947", 0, 30);
      ctx.restore();

      // Signatory Line
      ctx.strokeStyle = "#1b1b1b";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(480, 985);
      ctx.lineTo(750, 985);
      ctx.stroke();

      ctx.fillStyle = "#1b1b1b";
      ctx.font = "bold 15px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Authorized Signatory", 615, 1010);
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#736b5e";
      ctx.fillText("Central Executive Committee", 615, 1030);

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

export const DigitalIdCard: React.FC<DigitalIdCardProps> = ({ member, qrDataUrl }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      // Direct high-res 800x1200 canvas generator (fast, reliable, zero font or CORS glitches)
      const dataUrl = await generateIdCardCanvas(member, qrDataUrl);
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

  const handlePrint = () => {
    window.print();
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
                className="w-11 h-11 rounded-full object-cover border-2 border-[#cc785c] shadow-sm flex-shrink-0"
              />
              <div className="text-center flex-1">
                <div className="font-serif font-black text-base tracking-tight text-ink uppercase leading-none">
                  Maha Seva Dal
                </div>
                <div className="text-[9px] font-sans font-bold text-[#cc785c] tracking-widest uppercase mt-0.5">
                  Estd. 1947 · Unity of People's
                </div>
                <div className="text-[8px] text-muted-editorial font-medium">
                  National Socio-Cultural Cadre Registry
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#cc785c]/10 border border-[#cc785c]/30 flex flex-col items-center justify-center text-center flex-shrink-0">
                <ShieldCheck size={16} className="text-[#cc785c]" />
                <span className="text-[6px] font-mono font-bold text-[#cc785c]">1947</span>
              </div>
            </div>

            {/* Official Badge Title Bar */}
            <div className="mt-2 py-0.5 px-2 bg-gradient-to-r from-[#cc785c] to-[#b86144] rounded text-center shadow-xs">
              <span className="text-[9px] font-bold text-white tracking-wider uppercase font-sans">
                Official National Cadre Identity Card
              </span>
            </div>
          </div>

          {/* Card Body Profile Section */}
          <div className="p-4 space-y-3.5">
            {/* Top Row: Photo & Core Identifiers */}
            <div className="flex items-start gap-3.5">
              {/* Photo Box */}
              <div className="relative flex-shrink-0">
                <div className="w-[100px] h-[120px] rounded-lg overflow-hidden border-2 border-[#cc785c] bg-surface-soft shadow-md flex items-center justify-center">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-editorial">
                      <User size={38} className="text-[#cc785c]" />
                      <span className="text-[8px] mt-1 font-mono uppercase">Member</span>
                    </div>
                  )}
                </div>
                {/* Verified Ribbon */}
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-sm">
                  <CheckCircle2 size={14} />
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
                  <div className="font-mono text-xs font-bold text-[#cc785c] bg-surface-soft px-2 py-0.5 rounded border border-[#e5dac8] inline-block shadow-2xs">
                    {member.registrationId}
                  </div>
                </div>

                <div>
                  <span className="text-[8px] text-muted-editorial uppercase font-bold tracking-wider block">
                    Assigned Wing
                  </span>
                  <div className="text-[10px] font-bold text-ink bg-[#cc785c]/10 text-[#cc785c] px-2 py-0.5 rounded-md border border-[#cc785c]/25 inline-block">
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
                  <div className="font-bold text-[#cc785c]">SCAN TO VERIFY</div>
                  <div>Official Cadre</div>
                  <div className="font-mono text-[7px]">mahasevadal.org</div>
                </div>
              </div>

              {/* Authorized Seal & Stamp */}
              <div className="text-right flex flex-col items-end">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#cc785c]/60 flex flex-col items-center justify-center text-center p-0.5 rotate-[-8deg] bg-[#cc785c]/5">
                  <span className="text-[5px] font-black uppercase text-[#cc785c] leading-tight">
                    MAHA SEVA DAL
                  </span>
                  <span className="text-[7px] font-black uppercase text-ink">★ SEAL ★</span>
                  <span className="text-[5px] font-mono text-[#cc785c] leading-tight">VERIFIED 1947</span>
                </div>
                <div className="mt-1 border-t border-ink/40 w-24 text-right pt-0.5">
                  <span className="text-[7px] font-bold text-ink uppercase tracking-wider block">
                    Authorized Signatory
                  </span>
                  <span className="text-[6px] text-muted-editorial block">National Committee</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Band */}
          <div className="py-1 px-3 bg-[#3d3832] text-white flex items-center justify-between text-[7px] font-mono">
            <span>GOVT REG: 1947/MSD/NAT</span>
            <span className="text-[#FF9933] font-bold">UNITY OF PEOPLE'S</span>
            <span>CARD NO: {member.registrationId.split("-").pop()}</span>
          </div>
        </div>
      </div>

      {/* ─── ACTION BUTTONS (DOWNLOAD & PRINT) ─── */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="btn-primary-coral text-xs px-5 py-2.5 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {downloading ? (
            <>
              <span className="animate-spin text-sm">⏳</span>
              <span>Downloading Card...</span>
            </>
          ) : (
            <>
              <Download size={14} />
              <span>Download ID Card (PNG)</span>
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-2"
        >
          <Printer size={14} />
          <span>Print Card</span>
        </button>
      </div>
    </div>
  );
};

export default DigitalIdCard;
