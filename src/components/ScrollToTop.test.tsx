import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter, Link } from "react-router-dom";
import ScrollToTop, { scrollToPageTop } from "./ScrollToTop";

describe("ScrollToTop Component & scrollToPageTop Utility", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    (window as any).lenis = {
      scrollTo: vi.fn(),
    };
    document.documentElement.scrollTop = 500;
    document.body.scrollTop = 500;
  });

  it("calls window.scrollTo and lenis.scrollTo when scrollToPageTop is invoked", () => {
    scrollToPageTop();

    expect((window as any).lenis.scrollTo).toHaveBeenCalledWith(0, { immediate: true });
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
    expect(document.documentElement.scrollTop).toBe(0);
    expect(document.body.scrollTop).toBe(0);
  });

  it("automatically scrolls to top when route changes", () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={["/events"]}>
        <ScrollToTop />
      </MemoryRouter>
    );

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
    unmount();
  });

  it("scrolls to top when clicking any internal link on the page", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ScrollToTop />
        <Link to="/events">Go to Events</Link>
      </MemoryRouter>
    );

    // Reset spy call count
    (window.scrollTo as any).mockClear();
    (window as any).lenis.scrollTo.mockClear();

    const link = getByText("Go to Events");
    fireEvent.click(link);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "instant" });
    expect((window as any).lenis.scrollTo).toHaveBeenCalledWith(0, { immediate: true });
  });

  it("does not intercept external mailto: or tel: links", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ScrollToTop />
        <a href="mailto:test@example.com" onClick={(e) => e.preventDefault()}>Contact Us</a>
      </MemoryRouter>
    );

    (window.scrollTo as any).mockClear();

    const mailLink = getByText("Contact Us");
    fireEvent.click(mailLink);

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
