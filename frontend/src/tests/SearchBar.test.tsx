import "@testing-library/jest-dom";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import { useRootStore } from "@/store/store";
import * as api from "@/api/getApis";
import SearchBar from "@/components/SearchBar";

beforeAll(() => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.ResizeObserver = ResizeObserver;
  global.HTMLElement.prototype.scrollIntoView = jest.fn();
});

// Mock the API
jest.mock("@/api/getApis", () => ({
  getCountries: jest.fn(),
  saveUserSearch: jest.fn(),
}));

describe("SearchBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset the Zustand store state
    useRootStore.setState({
      countries: ["Country A"],
      setCountries: jest.fn(),
      userEmail: "test@example.com",
    });

    // Mock API response for `getCountries`
    (api.getCountries as jest.Mock).mockResolvedValue([
      "Country A",
      "Country B",
      "Country C",
    ]);
  });

  it("renders correctly", async () => {
    await act(async () => {
      render(<SearchBar />);
    });
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("displays country options when clicked", async () => {
    await act(async () => {
      render(<SearchBar />);
    });

    // Click on the combobox
    await act(async () => {
      fireEvent.click(screen.getByRole("combobox"));
    });

    // Wait for the options to load
    await waitFor(() => {
      expect(screen.getByText("Country A")).toBeInTheDocument();
      expect(screen.getByText("Country B")).toBeInTheDocument();
      expect(screen.getByText("Country C")).toBeInTheDocument();
    });
  });

  it("filters country list based on input", async () => {
    await act(async () => {
      render(<SearchBar />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("combobox"));
    });

    // Type in the search input
    const input = screen.getByPlaceholderText("Search country...");
    fireEvent.change(input, { target: { value: "Country B" } });

    // Wait for the options to update
    await waitFor(() => {
      expect(screen.getByText("Country B")).toBeInTheDocument();
      expect(screen.queryByText("Country A")).not.toBeInTheDocument();
      expect(screen.queryByText("Country C")).not.toBeInTheDocument();
    });
  });

  it("adds selected country to the list and calls saveUserSearch", async () => {
    const setCountries = useRootStore.getState().setCountries as jest.Mock;

    await act(async () => {
      render(<SearchBar />);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("combobox"));
    });

    // Select 'Country B'
    const countryBOption = await screen.findByText("Country B");
    fireEvent.click(countryBOption);

    // Wait for state updates
    await waitFor(() => {
      expect(setCountries).toHaveBeenCalledWith(["Country A", "Country B"]);
      expect(api.saveUserSearch).toHaveBeenCalledWith("test@example.com", [
        "Country A",
        "Country B",
      ]);
    });
  });
});
