import { describe, expect, test, vi } from "vitest";
import { find, set } from "../../framework/local-storage";
import { checkIsSeenWith, setLastSeenWith } from "./last-seen";

describe("Last seen at", () => {
  test("set last seen at", () => {
    const setter = vi.fn<typeof set>(() => ({ expiresAt: 10 }));
    const setLastSeen = setLastSeenWith(setter);

    const result = setLastSeen();

    expect(result).toEqual({ expiresAt: 10 });
  });

  test("check if seen when not seen", () => {
    const finder = vi.fn<typeof find>(() => ({
      ok: false,
      error: "not found",
    }));
    const checkIsSeen = checkIsSeenWith(finder);

    const result = checkIsSeen();

    expect(result).toEqual({ ok: false });
  });

  test("check if seen when seen", () => {
    const finder = vi.fn<typeof find>(() => ({ ok: true, value: "" }));
    const checkIsSeen = checkIsSeenWith(finder);

    const result = checkIsSeen();

    expect(result).toEqual({ ok: true });
  });
});
