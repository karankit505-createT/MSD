import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Leadership from "./Leadership";

describe("Leadership Page - Presidential Biography Modal Popup", () => {
  const renderLeadership = (initialEntries = ["/leadership"]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Leadership />
      </MemoryRouter>
    );
  };

  it("renders the presidential lineage gallery cards", () => {
    renderLeadership();
    expect(screen.getByText(/Official Presidents Gallery/i)).toBeInTheDocument();
    expect(screen.getByText("Narendra Singh")).toBeInTheDocument();
  });

  it("does not display the old inline banner with '↑ Gallery' or 'Close Biography' button on load", () => {
    renderLeadership();
    expect(screen.queryByText(/Close Biography/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/↑ Gallery/i)).not.toBeInTheDocument();
  });

  it("opens the modal popup when clicking the About button on a leader card", () => {
    renderLeadership();
    
    // Find all 'About' buttons and click the one for Narendra Singh (3rd president, index 2)
    const aboutButtons = screen.getAllByRole("button", { name: /^About/i });
    expect(aboutButtons.length).toBeGreaterThan(0);
    fireEvent.click(aboutButtons[2]);

    // The modal dialog should now be in the document
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    // Verify Narendra Singh's info is visible inside the popup
    expect(screen.getAllByText("Narendra Singh").length).toBeGreaterThan(1);
    expect(screen.getByText(/Tenure Highlights & Achievements/i)).toBeInTheDocument();

    // Verify single cut/close button (X) exists in the popup
    const closeBtn = screen.getByRole("button", { name: /Close/i });
    expect(closeBtn).toBeInTheDocument();
  });

  it("closes the modal popup when clicking the cut/close (X) button", () => {
    renderLeadership();
    
    const aboutButtons = screen.getAllByRole("button", { name: /^About/i });
    fireEvent.click(aboutButtons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /Close/i });
    fireEvent.click(closeBtn);

    // Dialog should be gone
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the modal popup when pressing Escape key", () => {
    renderLeadership();
    
    const aboutButtons = screen.getAllByRole("button", { name: /^About/i });
    fireEvent.click(aboutButtons[1]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("automatically opens the modal popup when navigated with a hash like #narendra-1961", () => {
    renderLeadership(["/leadership#narendra-1961"]);

    // Should immediately open dialog for Narendra Singh
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getAllByText("Narendra Singh").length).toBeGreaterThan(1);
  });
});
