import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Flashcard from "./Flashcard";
import * as utils from "../utils";

vi.mock("../utils", () => ({
  getData: vi.fn(),
}));

const mockElements = [
  {
    symbol: "H",
    name: "Hydrogen",
    number: 1,
    symbolOrigin: "From the Greek hydros",
  },
  {
    symbol: "He",
    name: "Helium",
    number: 2,
    symbolOrigin: "From the Greek helios",
  },
];

beforeEach(() => {
  vi.mocked(utils.getData).mockResolvedValue(mockElements);
});

describe("Flashcard", () => {
  it("shows loading state before data arrives", () => {
    vi.mocked(utils.getData).mockImplementation(() => new Promise(() => {}));
    render(<Flashcard onBack={vi.fn()} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows the element symbol once loaded", async () => {
    render(<Flashcard onBack={vi.fn()} />);
    expect(await screen.findByText("H")).toBeInTheDocument();
  });

  it("shows the Reveal Name button before reveal", async () => {
    render(<Flashcard onBack={vi.fn()} />);
    expect(await screen.findByText("Reveal Name")).toBeInTheDocument();
  });

  it("shows the element name after clicking Reveal Name", async () => {
    render(<Flashcard onBack={vi.fn()} />);
    await userEvent.click(await screen.findByText("Reveal Name"));
    expect(screen.getByText("Hydrogen")).toBeInTheDocument();
  });

  it("shows rating buttons after reveal", async () => {
    render(<Flashcard onBack={vi.fn()} />);
    await userEvent.click(await screen.findByText("Reveal Name"));
    expect(screen.getByText("Got It")).toBeInTheDocument();
    expect(screen.getByText("Nearly")).toBeInTheDocument();
    expect(screen.getByText("No idea")).toBeInTheDocument();
  });

  it("marks a rating button as selected when clicked", async () => {
    render(<Flashcard onBack={vi.fn()} />);
    await userEvent.click(await screen.findByText("Reveal Name"));
    const gotItButton = screen.getByText("Got It");
    await userEvent.click(gotItButton);
    expect(gotItButton).toHaveClass("btn-rating--selected");
  });

  it("shows Reveal Origin button after reveal", async () => {
    render(<Flashcard onBack={vi.fn()} />);
    await userEvent.click(await screen.findByText("Reveal Name"));
    expect(screen.getByText("Reveal Origin")).toBeInTheDocument();
  });

  it("shows origin text after clicking Reveal Origin", async () => {
    render(<Flashcard onBack={vi.fn()} />);
    await userEvent.click(await screen.findByText("Reveal Name"));
    await userEvent.click(screen.getByText("Reveal Origin"));
    expect(screen.getByText("From the Greek hydros")).toBeInTheDocument();
  });

  it("advances to the next element and resets state after clicking Next", async () => {
    render(<Flashcard onBack={vi.fn()} />);
    await userEvent.click(await screen.findByText("Reveal Name"));
    await userEvent.click(screen.getByText("Next →"));
    expect(screen.getByText("He")).toBeInTheDocument();
    expect(screen.getByText("Reveal Name")).toBeInTheDocument();
  });

  it("calls onBack when the back button is clicked", async () => {
    const onBack = vi.fn();
    render(<Flashcard onBack={onBack} />);
    await userEvent.click(await screen.findByText("← Periodic Table"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
