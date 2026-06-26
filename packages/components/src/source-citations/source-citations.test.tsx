import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SourceCitation, SourceList } from "./source-citations";

const sources = [
  { title: "First source", url: "https://example.com/a", snippet: "Snippet A" },
  { title: "Second source", url: "https://docs.example.com/b" },
  { title: "Third source", url: "https://blog.example.com/c" },
  { title: "Fourth source", url: "https://news.example.com/d" },
];

describe("SourceCitation", () => {
  it("renders the index and links to the source", () => {
    render(<SourceCitation index={2} source={sources[0]} />);
    const link = screen.getByRole("link");
    expect(link).toHaveTextContent("2");
    expect(link).toHaveAttribute("href", "https://example.com/a");
  });

  it("reveals the preview card on hover", () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<SourceCitation ref={ref} index={1} source={sources[0]} />);
    fireEvent.focus(screen.getByRole("link"));
    expect(screen.getByRole("tooltip")).toHaveTextContent("First source");
  });
});

describe("SourceList", () => {
  it("collapses extra sources behind a toggle", () => {
    render(<SourceList sources={sources} previewCount={2} />);
    expect(screen.queryByText("Third source")).not.toBeInTheDocument();
    fireEvent.click(screen.getByText("+2 more"));
    expect(screen.getByText("Third source")).toBeInTheDocument();
  });

  it("shows all sources when not collapsible", () => {
    render(<SourceList sources={sources} collapsible={false} />);
    expect(screen.getByText("Fourth source")).toBeInTheDocument();
  });
});
