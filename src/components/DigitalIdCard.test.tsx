import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DigitalIdCard from "./DigitalIdCard";

describe("DigitalIdCard Component", () => {
  const sampleMember = {
    registrationId: "MSD-KA-2026-0001",
    fullName: "Arun Kumar",
    fatherName: "Ramesh Kumar",
    dob: "1990-05-15",
    gender: "Male",
    mobile: "9876543210",
    bloodGroup: "O+",
    state: "Karnataka",
    district: "Bangalore Urban",
    taluk: "Bangalore North",
    wing: "Youth Wing",
    status: "Approved",
    createdAt: "2026-01-10T10:00:00.000Z",
  };

  const sampleQr = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

  it("should render member name and registration ID", () => {
    render(<DigitalIdCard member={sampleMember} qrDataUrl={sampleQr} />);

    // Check member name is rendered
    expect(screen.getAllByText(/Arun Kumar/i).length).toBeGreaterThan(0);
    // Check registration ID is displayed
    expect(screen.getAllByText(/MSD-KA-2026-0001/i).length).toBeGreaterThan(0);
  });

  it("should render location and wing details", () => {
    render(<DigitalIdCard member={sampleMember} qrDataUrl={sampleQr} />);

    expect(screen.getAllByText(/Karnataka/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Bangalore Urban/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Youth Wing/i).length).toBeGreaterThan(0);
  });

  it("should render QR code element with provided qrDataUrl", () => {
    render(<DigitalIdCard member={sampleMember} qrDataUrl={sampleQr} />);

    const qrImages = screen.getAllByAltText(/Verify QR/i);
    expect(qrImages.length).toBeGreaterThan(0);
    expect(qrImages[0]).toHaveAttribute("src", sampleQr);
  });

  it("should not display provisional pending watermark when member is Approved", () => {
    render(<DigitalIdCard member={sampleMember} qrDataUrl={sampleQr} />);

    expect(screen.queryByText(/PROVISIONAL · PENDING/i)).not.toBeInTheDocument();
  });

  it("should display PROVISIONAL · PENDING watermark when member is Pending", () => {
    const pendingMember = { ...sampleMember, status: "Pending" };
    render(<DigitalIdCard member={pendingMember} qrDataUrl={sampleQr} />);

    expect(screen.getByText(/PROVISIONAL · PENDING/i)).toBeInTheDocument();
  });

  it("should hide action buttons when hideActionButtons is true", () => {
    render(<DigitalIdCard member={sampleMember} qrDataUrl={sampleQr} hideActionButtons={true} />);

    expect(screen.queryByText(/Download PDF/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Download PNG/i)).not.toBeInTheDocument();
  });
});
