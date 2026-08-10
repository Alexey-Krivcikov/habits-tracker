import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import ErrorPage from "./error";

const renderPage = (props: { error?: Error; reset?: () => void }) =>
  render(
    <MantineProvider>
      <ErrorPage error={props.error ?? new Error("boom")} reset={props.reset ?? (() => {})} />
    </MantineProvider>,
  );

describe("ErrorPage", () => {
  it("renders the error title and description", () => {
    renderPage({});

    expect(screen.getByRole("heading", { name: "Что-то пошло не так" })).toBeInTheDocument();
    expect(screen.getByText(/Произошла непредвиденная ошибка/)).toBeInTheDocument();
  });

  it("calls reset when the retry button is clicked", () => {
    const reset = vi.fn();
    renderPage({ reset });

    fireEvent.click(screen.getByRole("button", { name: "Попробовать снова" }));

    expect(reset).toHaveBeenCalledTimes(1);
  });
});
