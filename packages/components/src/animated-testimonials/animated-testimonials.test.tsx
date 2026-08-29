import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  AnimatedTestimonials,
  type Testimonial,
} from "./animated-testimonials";

const testimonials: Testimonial[] = [
  {
    quote: "The first quote remains available.",
    name: "Ada Lovelace",
    role: "Analytical Engineer",
    src: "/ada.jpg",
  },
  {
    quote: "The second quote adds useful context.",
    name: "Grace Hopper",
    role: "Compiler Engineer",
    src: "/grace.jpg",
  },
  {
    quote: "The final quote completes the set.",
    name: "Alan Turing",
    role: "Computing Pioneer",
    src: "/alan.jpg",
  },
];

describe("AnimatedTestimonials", () => {
  it("keeps a valid item active when testimonials shrink, empty, and repopulate", async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <AnimatedTestimonials testimonials={testimonials} autoplay={false} />,
    );
    const next = screen.getByRole("button", { name: "Next testimonial" });

    await user.click(next);
    await user.click(next);
    expect(await screen.findByText("Alan Turing")).toBeInTheDocument();

    rerender(
      <AnimatedTestimonials
        testimonials={[testimonials[0]]}
        autoplay={false}
      />,
    );
    expect(await screen.findByText("Ada Lovelace")).toBeInTheDocument();

    rerender(<AnimatedTestimonials testimonials={[]} autoplay={false} />);
    expect(container.firstChild).toBeNull();

    rerender(
      <AnimatedTestimonials
        testimonials={[testimonials[1]]}
        autoplay={false}
      />,
    );
    expect(await screen.findByText("Grace Hopper")).toBeInTheDocument();
  });
});
