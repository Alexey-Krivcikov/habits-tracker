import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

const renderPage = () =>
  render(
    <MantineProvider>
      <NotFound />
    </MantineProvider>,
  );

describe("NotFound", () => {
  it("renders the not found title and description", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Страница не найдена" })).toBeInTheDocument();
    expect(screen.getByText(/Такой страницы не существует/)).toBeInTheDocument();
  });

  it("links back to the home page", () => {
    renderPage();

    expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute("href", "/");
  });
});
