import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Origins from "./Origins";

describe("Origins Page - Functionality & In-Place Founder Modal", () => {
  const renderOrigins = () => {
    return render(
      <MemoryRouter initialEntries={["/origins"]}>
        <Origins />
      </MemoryRouter>
    );
  };

  it("renders the Origins page and key facts summary box", () => {
    renderOrigins();
    expect(screen.getByText(/Origins and Foundation/i)).toBeInTheDocument();
    expect(screen.getByText("1947")).toBeInTheDocument();
    expect(screen.getByText("Saragabani Gopu")).toBeInTheDocument();
    expect(screen.getByText("National & Social")).toBeInTheDocument();
  });

  it("ensures Founder & President in Key Facts summary box is static unclickable text", () => {
    renderOrigins();
    const founderText = screen.getByText("Saragabani Gopu");
    // Should NOT be inside an <a> or <button>
    expect(founderText.closest("a")).toBeNull();
    expect(founderText.closest("button")).toBeNull();
  });

  it("opens the founder biography modal in-place when clicking the archival portrait photo", () => {
    renderOrigins();
    
    // Dialog should initially not be present
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const founderImg = screen.getByAltText(/Founder Saragabani Gopu - 1947 Foundation/i);
    expect(founderImg).toBeInTheDocument();

    // Click the photo container
    const photoContainer = founderImg.closest("div");
    expect(photoContainer).not.toBeNull();
    fireEvent.click(photoContainer!);

    // Dialog should now be open
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/Tenure Highlights & Achievements/i)).toBeInTheDocument();
    expect(screen.getByText(/Founding Proclamation Address \(1947\)/i)).toBeInTheDocument();
  });

  it("closes the founder modal when clicking the cut (X) button", () => {
    renderOrigins();

    const founderImg = screen.getByAltText(/Founder Saragabani Gopu - 1947 Foundation/i);
    fireEvent.click(founderImg.closest("div")!);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /Close/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the founder modal when pressing Escape", () => {
    renderOrigins();

    const founderImg = screen.getByAltText(/Founder Saragabani Gopu - 1947 Foundation/i);
    fireEvent.click(founderImg.closest("div")!);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
