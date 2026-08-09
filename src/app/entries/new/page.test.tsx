import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import NewEntryPage from "./page";

vi.mock("@/features/entries", () => ({
  EntryForm: () => <form aria-label="Форма новой записи" />,
}));

const renderPage = () =>
  render(
    <MantineProvider>
      <NewEntryPage />
    </MantineProvider>,
  );

describe("NewEntryPage", () => {
  it("renders the page title", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: "Новая запись" })).toBeInTheDocument();
  });

  it("renders the description", () => {
    renderPage();

    expect(screen.getByText(/Запишите свой успех/)).toBeInTheDocument();
  });

  it("renders the entry form", () => {
    renderPage();

    expect(screen.getByRole("form", { name: "Форма новой записи" })).toBeInTheDocument();
  });
});
