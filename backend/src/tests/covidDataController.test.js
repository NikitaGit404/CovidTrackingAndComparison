// tests/covidDataController.test.js
const covidDataController = require("../controllers/covidDataController");
const CovidData = require("../models/CovidData");
const Sequelize = require("sequelize");

jest.mock("../models/CovidData");

describe("covidDataController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getCountries", () => {
    it("should return a list of countries", async () => {
      // Mock data
      const mockCountries = [
        { get: jest.fn().mockReturnValue("Country A") },
        { get: jest.fn().mockReturnValue("Country B") },
      ];

      CovidData.findAll.mockResolvedValue(mockCountries);

      // Mock request and response
      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await covidDataController.getCountries(req, res);

      expect(CovidData.findAll).toHaveBeenCalledWith({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("country")), "country"],
        ],
        order: [[Sequelize.col("country"), "ASC"]],
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(["Country A", "Country B"]);
    });

    it("should handle errors", async () => {
      CovidData.findAll.mockRejectedValue(new Error("Database error"));

      const req = {};
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await covidDataController.getCountries(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error: Error fetching countries",
      });
    });
  });

  describe("getCasesByCountry", () => {
    it("should return cases by country and date", async () => {
      const req = {
        query: {
          dateFrom: "2021-01-01",
          dateTo: "2021-01-31",
          countries: '["Country A","Country B"]',
          column: "new_cases",
        },
      };

      const mockData = [
        { date: "2021-01-01", country: "Country A", new_cases: 100 },
        { date: "2021-01-01", country: "Country B", new_cases: 150 },
      ];

      CovidData.findAll.mockResolvedValue(mockData);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await covidDataController.getCasesByCountry(req, res);

      expect(CovidData.findAll).toHaveBeenCalledWith({
        where: expect.any(Object),
        attributes: ["date", "new_cases", "country"],
        order: [
          ["date", "ASC"],
          ["country", "ASC"],
        ],
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
    });

    it("should return 400 if countries parameter is invalid", async () => {
      const req = {
        query: {
          column: "new_cases",
        },
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await covidDataController.getCasesByCountry(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Countries must be a non-empty array",
      });
    });
  });

  describe("getVaccinationPercentage", () => {
    it("should return vaccination percentages for countries", async () => {
      const req = {
        query: {
          countries: '["Country A","Country B"]',
        },
      };

      const mockData = [
        {
          toJSON: () => ({
            country: "Country A",
            maxVaccinated: 500000,
            population: 1000000,
            avgLifeExpectancy: 75,
          }),
        },
        {
          toJSON: () => ({
            country: "Country B",
            maxVaccinated: 300000,
            population: 800000,
            avgLifeExpectancy: 70,
          }),
        },
      ];

      CovidData.findAll.mockResolvedValue(mockData);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await covidDataController.getVaccinationPercentage(req, res);

      expect(CovidData.findAll).toHaveBeenCalledWith({
        where: {
          country: {
            [Sequelize.Op.in]: ["Country A", "Country B"],
          },
        },
        attributes: expect.any(Array),
        group: ["country", "population"],
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          country: "Country A",
          percentage: 50.0,
          avgLifeExpectancy: 75.0,
        },
        {
          country: "Country B",
          percentage: 37.5,
          avgLifeExpectancy: 70.0,
        },
      ]);
    });

    it("should handle missing countries parameter", async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await covidDataController.getVaccinationPercentage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Countries parameter is required",
      });
    });
  });
});
