import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Quiz from "./Quiz";
import * as utils from "../utils";

vi.mock("../utils", () => ({
  getData: vi.fn(),
  getRandomElements: vi.fn(),
  getOtherElementOptions: vi.fn(),
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
  {
    symbol: "Li",
    name: "Lithium",
    number: 3,
    symbolOrigin: "From the Greek lithos",
  },
  { symbol: "Be", name: "Beryllium", number: 4, symbolOrigin: "From beryl" },
];

const mockOptions = [
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
  {
    symbol: "Li",
    name: "Lithium",
    number: 3,
    symbolOrigin: "From the Greek lithos",
  },
  { symbol: "Be", name: "Beryllium", number: 4, symbolOrigin: "From beryl" },
];

beforeEach(() => {
  vi.mocked(utils.getData).mockResolvedValue(mockElements);
  vi.mocked(utils.getRandomElements).mockReturnValue([
    mockElements[0],
    mockElements[1],
  ]);
  vi.mocked(utils.getOtherElementOptions).mockReturnValue(mockOptions);
});

describe("Quiz", () => {
  it("shows loading state before data arrives", () => {
    vi.mocked(utils.getData).mockImplementation(() => new Promise(() => {}));
    render(<Quiz onBack={vi.fn()} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows the question symbol once loaded", async () => {
    render(<Quiz onBack={vi.fn()} />);
    expect(await screen.findByText("H")).toBeInTheDocument();
  });

  it("shows four answer options", async () => {
    render(<Quiz onBack={vi.fn()} />);
    const options = await screen.findAllByRole("button", {
      name: /hydrogen|helium|lithium|beryllium/i,
    });
    expect(options).toHaveLength(4);
  });

  it("highlights the correct answer when selected", async () => {
    render(<Quiz onBack={vi.fn()} />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Hydrogen" }),
    );
    expect(screen.getByRole("button", { name: "Hydrogen" })).toHaveClass(
      "btn-option--correct",
    );
  });

  it("highlights incorrect and correct answers when wrong answer selected", async () => {
    render(<Quiz onBack={vi.fn()} />);
    await screen.findByText("H");
    await userEvent.click(screen.getByRole("button", { name: "Helium" }));
    expect(screen.getByRole("button", { name: "Helium" })).toHaveClass(
      "btn-option--incorrect",
    );
    expect(screen.getByRole("button", { name: "Hydrogen" })).toHaveClass(
      "btn-option--correct",
    );
  });

  it("increments score on correct answer", async () => {
    render(<Quiz onBack={vi.fn()} />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Hydrogen" }),
    );
    expect(screen.getByText("Score: 1")).toBeInTheDocument();
  });

  it("does not increment score on incorrect answer", async () => {
    render(<Quiz onBack={vi.fn()} />);
    await screen.findByText("H");
    await userEvent.click(screen.getByRole("button", { name: "Helium" }));
    expect(screen.getByText("Score: 0")).toBeInTheDocument();
  });

  it("shows Next button after an answer is selected", async () => {
    render(<Quiz onBack={vi.fn()} />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Hydrogen" }),
    );
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("shows EndScreen after the last question", async () => {
    render(<Quiz onBack={vi.fn()} />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Hydrogen" }),
    );
    await userEvent.click(screen.getByText("Next"));
    await userEvent.click(
      await screen.findByRole("button", { name: "Helium" }),
    );
    await userEvent.click(screen.getByText("Next"));
    expect(await screen.findByText("Play Again")).toBeInTheDocument();
  });

  it("resets the quiz when Play Again is clicked", async () => {
    render(<Quiz onBack={vi.fn()} />);
    await userEvent.click(
      await screen.findByRole("button", { name: "Hydrogen" }),
    );
    await userEvent.click(screen.getByText("Next"));
    await userEvent.click(
      await screen.findByRole("button", { name: "Helium" }),
    );
    await userEvent.click(screen.getByText("Next"));
    await userEvent.click(await screen.findByText("Play Again"));
    expect(await screen.findByText("H")).toBeInTheDocument();
  });

  it("calls onBack when the back button is clicked", async () => {
    const onBack = vi.fn();
    render(<Quiz onBack={onBack} />);
    await userEvent.click(await screen.findByText("← Periodic Table"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
