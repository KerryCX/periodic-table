import type { Element } from "./types";

export async function getData(): Promise<Element[]> {
  const response = await fetch("/listOfElements.json");
  if (!response.ok) throw new Error("Failed to load JSON");
  const data = await response.json();
  return data;
}

export const getRandomElements = (
  elements: Element[],
  count: number,
): Element[] => {
  return [...elements].sort(() => Math.random() - 0.5).slice(0, count);
};

export const getOtherElementOptions = (
  correct: Element,
  allElements: Element[],
): Element[] => {
  const others = allElements
    .filter((e) => e.symbol !== correct.symbol)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [...others, correct].sort(() => Math.random() - 0.5);
};
