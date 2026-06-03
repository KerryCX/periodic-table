import type { Element } from "./types";

export async function getData(): Promise<Element[]> {
  const response = await fetch("/listOfElements.json");
  if (!response.ok) throw new Error("Failed to load JSON");
  const data = await response.json();
  return data;
}
