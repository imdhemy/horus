import { describe, expect, test, vi } from "vitest";
import { sessionStorage } from "../../framework/session-storage";
import { checkIsSeenWith, setLastSeenWith } from "./last-seen";

describe("Last seen at", () => {
  test("stores the timestamp for the session", () => {
    const setter = vi.fn<typeof sessionStorage.set>();
    const clock = { now: () => 123456789 };
    const setLastSeen = setLastSeenWith(setter)(clock);

    setLastSeen();

    expect(setter).toHaveBeenCalledWith("SPLASH_LAST_SEEN_AT", "123456789");
  });

  test("check if seen when not seen", () => {
    const finder = vi.fn<typeof sessionStorage.find>(() => undefined);
    expect(checkIsSeenWith(finder)()).toBe(false);
    expect(finder).toHaveBeenCalledWith("SPLASH_LAST_SEEN_AT");
  });

  test("check if seen when the marker has an empty value", () => {
    const finder = vi.fn<typeof sessionStorage.find>(() => "");
    expect(checkIsSeenWith(finder)()).toBe(true);
  });
});
