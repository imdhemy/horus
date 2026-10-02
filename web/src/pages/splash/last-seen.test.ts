import { describe, expect, test, vi } from "vitest";
import { cookie } from "../../framework/cookies";
import { checkIsSeenWith, setLastSeenWith } from "./last-seen";

describe("Last seen at", () => {
  test("stores the timestamp for one hour", () => {
    const setter = vi.fn<typeof cookie.set>();
    const clock = { now: () => 123456789 };
    const setLastSeen = setLastSeenWith(setter)(clock);

    setLastSeen();

    expect(setter).toHaveBeenCalledWith(
      "SPLASH_LAST_SEEN_AT",
      "123456789",
      3600,
    );
  });

  test("check if seen when not seen", () => {
    const finder = vi.fn<typeof cookie.find>(() => undefined);
    expect(checkIsSeenWith(finder)()).toEqual({ ok: false });
    expect(finder).toHaveBeenCalledWith("SPLASH_LAST_SEEN_AT");
  });

  test("check if seen when the marker has an empty value", () => {
    const finder = vi.fn<typeof cookie.find>(() => "");
    expect(checkIsSeenWith(finder)()).toEqual({ ok: true });
  });
});
