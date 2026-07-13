import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "../lib/stores/auth-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    // Reset state before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("should initialize with default guest state", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it("should successfully log out and clear state", async () => {
    // Set authenticated state
    useAuthStore.setState({
      user: {
        id: "1",
        email: "test@test.com",
        full_name: "Test User",
        phone: null,
        avatar_url: null,
        role: "user",
        is_verified: true,
        province: null,
        city: null,
        country: "Indonesia",
        bio: null,
        created_at: new Date().toISOString(),
        store_name: null,
        store_slug: null,
        store_logo: null,
        articles_read: 0,
        quizzes_passed: 0,
        total_orders: 0,
        co2_saved_kg: 0,
      },
      isAuthenticated: true,
    });

    // Run logout
    const store = useAuthStore.getState();
    
    // Mock global fetch
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );

    await store.logout();

    const updatedState = useAuthStore.getState();
    expect(updatedState.user).toBeNull();
    expect(updatedState.isAuthenticated).toBe(false);
  });
});
