import { describe, it, expect } from "vitest";
import { reducer } from "./use-toast";

describe("use-toast reducer", () => {
  const sampleToast = {
    id: "1",
    title: "Test Title",
    description: "Test Description",
    open: true,
  };

  it("should add a toast to state", () => {
    const initialState = { toasts: [] };
    const nextState = reducer(initialState, {
      type: "ADD_TOAST",
      toast: sampleToast,
    });

    expect(nextState.toasts).toHaveLength(1);
    expect(nextState.toasts[0].id).toBe("1");
    expect(nextState.toasts[0].title).toBe("Test Title");
  });

  it("should enforce TOAST_LIMIT and keep the newest toast", () => {
    const initialState = { toasts: [sampleToast] };
    const secondToast = {
      id: "2",
      title: "Second Title",
      description: "Second Description",
      open: true,
    };

    const nextState = reducer(initialState, {
      type: "ADD_TOAST",
      toast: secondToast,
    });

    // TOAST_LIMIT is 1, so the new toast replaces or takes priority
    expect(nextState.toasts).toHaveLength(1);
    expect(nextState.toasts[0].id).toBe("2");
  });

  it("should update an existing toast", () => {
    const initialState = { toasts: [sampleToast] };
    const nextState = reducer(initialState, {
      type: "UPDATE_TOAST",
      toast: { id: "1", title: "Updated Title" },
    });

    expect(nextState.toasts[0].title).toBe("Updated Title");
    expect(nextState.toasts[0].description).toBe("Test Description");
  });

  it("should dismiss a specific toast by setting open to false", () => {
    const initialState = { toasts: [sampleToast] };
    const nextState = reducer(initialState, {
      type: "DISMISS_TOAST",
      toastId: "1",
    });

    expect(nextState.toasts[0].open).toBe(false);
  });

  it("should remove a specific toast", () => {
    const initialState = { toasts: [sampleToast] };
    const nextState = reducer(initialState, {
      type: "REMOVE_TOAST",
      toastId: "1",
    });

    expect(nextState.toasts).toHaveLength(0);
  });

  it("should remove all toasts if toastId is undefined in REMOVE_TOAST", () => {
    const initialState = { toasts: [sampleToast] };
    const nextState = reducer(initialState, {
      type: "REMOVE_TOAST",
      toastId: undefined,
    });

    expect(nextState.toasts).toHaveLength(0);
  });
});
