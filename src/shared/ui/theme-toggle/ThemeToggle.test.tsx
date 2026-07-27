import { MantineProvider } from "@mantine/core";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeToggle } from "@/shared/ui";

const mockSetColorScheme = vi.fn();

vi.mock("@mantine/core", async () => {
  const actual = await vi.importActual("@mantine/core");
  return {
    ...actual,
    useMantineColorScheme: () => ({
      colorScheme: "dark",
      setColorScheme: mockSetColorScheme,
    }),
  };
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    mockSetColorScheme.mockClear();
  });

  it("renders a clickable button", () => {
    render(
      <MantineProvider>
        <ThemeToggle />
      </MantineProvider>,
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls setColorScheme with 'light' when clicked in dark mode", () => {
    render(
      <MantineProvider>
        <ThemeToggle />
      </MantineProvider>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockSetColorScheme).toHaveBeenCalledWith("light");
  });
});
