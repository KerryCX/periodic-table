import { describe, it, expect, beforeAll, vi } from "vitest";
import { getData, getRandomElements, getOtherElementOptions } from "./utils";
import type { Element } from "./types";

describe("getData", () => {
  it("returns an array of elements", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockElements,
    } as any);

    const result = await getData();
    expect(result).toEqual(mockElements);
  });

  it("throws an error if response is not ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    } as any);

    await expect(getData()).rejects.toThrow("Failed to load JSON");
  });
});

const mockElements: Element[] = Array.from({ length: 20 }, (_, i) => ({
  symbol: `E${i}`,
  name: `Element ${i}`,
  number: i + 1,
  symbolOrigin: `Origin ${i}`,
}));

describe("getRandomElements", () => {
  it("returns the correct number of elements", () => {
    const result = getRandomElements(mockElements, 10);
    expect(result).toHaveLength(10);
  });

  it("does not modify the original array", () => {
    const copy = [...mockElements];
    getRandomElements(mockElements, 10);
    expect(mockElements).toEqual(copy);
  });

  it("returns unique elements", () => {
    const result = getRandomElements(mockElements, 10);
    const symbols = result.map((e) => e.symbol);
    expect(new Set(symbols).size).toBe(10);
  });
});

describe("getOtherElementOptions", () => {
  let correct: Element;
  let result: Element[];

  beforeAll(() => {
    correct = mockElements[0];
    result = getOtherElementOptions(correct, mockElements);
  });

  it("returns 4 options", () => {
    expect(result).toHaveLength(4);
  });

  it("includes the correct element", () => {
    expect(result.some((e) => e.symbol === correct.symbol)).toBe(true);
  });

  it("does not duplicate the correct element", () => {
    const matches = result.filter((e) => e.symbol === correct.symbol);
    expect(matches).toHaveLength(1);
  });
});
