import { describe, expect, it } from "vitest";
import { createTimeForHuman } from "./time-for-human";

describe("Time for human", () => {
  it.each([
    { seconds: 59, expected: "just now" },
    { seconds: 60, expected: "1m ago" },
    { seconds: 60 * 60, expected: "1h ago" },
    { seconds: 24 * 60 * 60, expected: "1d ago" },
    { seconds: 7 * 24 * 60 * 60, expected: "1w ago" },
    { seconds: 30 * 24 * 60 * 60, expected: "1mo ago" },
    { seconds: 365 * 24 * 60 * 60, expected: "1y ago" },
    { seconds: 119, expected: "1m ago" },
    { seconds: -60, expected: "just now" },
  ])(
    "should format an age of $seconds seconds as $expected",
    ({ seconds, expected }) => {
      const now = 2_000_000_000_000;
      const format = createTimeForHuman({ now: () => now });
      const timestamp = now - seconds * 1000;

      const actual = format(timestamp);

      expect(actual).toBe(expected);
    },
  );
});
