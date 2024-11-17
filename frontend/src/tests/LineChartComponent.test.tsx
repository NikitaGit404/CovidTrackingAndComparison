import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";
import { useRootStore } from "@/store/store";
import { getCountryCases } from "@/api/getApis";
import LineChartComponent from "@/components/LineChartComponent";

// Mock the store and API
jest.mock("@/store/store", () => ({
  useRootStore: jest.fn(),
}));

jest.mock("@/api/getApis", () => ({
  getCountryCases: jest.fn().mockResolvedValue([
    { date: "2021-01-01", "Country A": 10, "Country B": 5 },
    { date: "2021-01-02", "Country A": 15, "Country B": 7 },
  ]),
}));

// Mock `ResizeObserver` to avoid testing environment issues
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe("LineChartComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Cast useRootStore to jest.Mock to avoid TypeScript errors
    (useRootStore as unknown as jest.Mock).mockReturnValue({
      countries: ["Country A", "Country B"],
      dateFrom: new Date("2021-01-01"),
      dateTo: new Date("2021-01-31"),
    });

    (getCountryCases as jest.Mock).mockResolvedValue([
      { date: "2021-01-01", "Country A": 10, "Country B": 5 },
      { date: "2021-01-02", "Country A": 15, "Country B": 7 },
    ]);
    jest.spyOn(console, "warn").mockImplementation((message) => {
      if (
        !message.includes(
          "The width(0) and height(0) of chart should be greater than 0"
        )
      ) {
        console.warn(message);
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders correctly", async () => {
    await act(async () => {
      render(
        <div style={{ width: 400, height: 300 }}>
          <LineChartComponent />
        </div>
      );
    });

    expect(screen.getByText("New Cases")).toBeInTheDocument();
  });

  it("calls API with correct parameters", async () => {
    render(<LineChartComponent />);

    await waitFor(() => {
      expect(getCountryCases).toHaveBeenCalledWith(
        "2020-12-31", // Adjusted start date
        "2021-01-30", // Adjusted end date
        ["Country A", "Country B"],
        "new_cases"
      );
    });
  });
});
