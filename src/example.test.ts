import { expect, test } from "vitest";

test("runs TypeScript tests", () => {
  const value: number = 21;
  expect(value * 2).toBe(42);
});
