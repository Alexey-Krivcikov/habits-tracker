import { render } from "@testing-library/react";
import Loading from "./loading";

describe("Loading", () => {
  it("renders the loading spinner", () => {
    const { container } = render(<Loading />);

    expect(container.querySelector('[class*="spinner"]')).not.toBeNull();
  });

  it("renders the wrapper container", () => {
    const { container } = render(<Loading />);

    expect(container.querySelector('[class*="wrapper"]')).not.toBeNull();
  });
});
