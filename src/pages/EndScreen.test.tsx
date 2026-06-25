import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import EndScreen from "./EndScreen";
import userEvent from "@testing-library/user-event";

const defaultProps = {
  score: 15,
  total: 20,
  onPlayAgain: vi.fn(),
  onBack: vi.fn(),
};

describe("EndScreen", () => {
  it("renders the score and total", () => {
    render(<EndScreen {...defaultProps} />);
    expect(screen.getByText("You scored 15 out of 20")).toBeInTheDocument();
  });

  it("shows Great work! for a high score", () => {
    render(<EndScreen {...defaultProps} score={15} total={20} />);
    expect(screen.getByText("Great work!")).toBeInTheDocument();
  });

  it("shows Good effort! for a mid score", () => {
    render(<EndScreen {...defaultProps} score={8} total={20} />);
    expect(screen.getByText("Good effort!")).toBeInTheDocument();
  });

  it("shows Keep practising! for a low score", () => {
    render(<EndScreen {...defaultProps} score={4} total={20} />);
    expect(screen.getByText("Keep practising!")).toBeInTheDocument();
  });

  it("calls onPlayAgain when Play Again is clicked", async () => {
    const onPlayAgain = vi.fn();
    render(<EndScreen {...defaultProps} onPlayAgain={onPlayAgain} />);
    await userEvent.click(screen.getByText("Play Again"));
    expect(onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it("calls onBack when Switch Mode is clicked", async () => {
    const onBack = vi.fn();
    render(<EndScreen {...defaultProps} onBack={onBack} />);
    await userEvent.click(screen.getByText("Switch Mode"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
