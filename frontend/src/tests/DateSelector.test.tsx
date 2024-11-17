import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { useRootStore } from "@/store/store";
import * as api from "@/api/getApis";
import DateSelector from "@/components/DateSelector";
import "@testing-library/jest-dom";

// Mock the API
jest.mock("@/api/getApis", () => ({
  saveUserSearch: jest.fn(),
}));

describe("DateSelector", () => {
  beforeEach(() => {
    // Reset the store's state before each test
    useRootStore.setState({
      dateFrom: null,
      dateTo: null,
      setDateFrom: jest.fn(),
      setDateTo: jest.fn(),
      userEmail: "test@example.com",
      countries: ["Country A", "Country B"],
      setCountries: jest.fn(),
      setUserEmail: jest.fn(),
    });
  });

  it("renders correctly", () => {
    render(<DateSelector />);
    expect(screen.getByText("Pick a date")).toBeInTheDocument();
  });

  it("calls saveUserSearch API when 'Go' button is clicked", async () => {
    const setDateFrom = useRootStore.getState().setDateFrom;
    const setDateTo = useRootStore.getState().setDateTo;

    render(<DateSelector />);

    // Simulate selecting a date range
    fireEvent.click(screen.getByTestId("date-selector"));
    // Assume your Calendar component allows selecting dates by text or label
    // Adjust selectors based on your actual implementation
    const startDateButton = screen.getAllByText("1")[0];
    const endDateButton = screen.getAllByText("10")[1];
    fireEvent.click(startDateButton);
    fireEvent.click(endDateButton);

    // Click "Go" button
    const goButton = screen.getByText("Set Date");
    fireEvent.click(goButton);

    // Wait for async actions
    await waitFor(() => {
      expect(setDateFrom).toHaveBeenCalled();
      expect(setDateTo).toHaveBeenCalled();
      expect(api.saveUserSearch).toHaveBeenCalledWith(
        "test@example.com",
        ["Country A", "Country B"],
        expect.any(Date),
        expect.any(Date)
      );
    });
  });
});
