// tests/userSearchController.test.js
const userSearchController = require("../controllers/userSearchController");
const UserSearch = require("../models/UserSearch");

jest.mock("../models/UserSearch");

describe("userSearchController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUserSearch", () => {
    it("should create a new user search when email does not exist", async () => {
      const req = {
        body: {
          email: "newuser@example.com",
          countries: ["Country A", "Country B"],
          dateFrom: "2021-01-01",
          dateTo: "2021-12-31",
        },
      };

      // Mock findOne to return null (email does not exist)
      UserSearch.findOne.mockResolvedValue(null);

      // Mock create to return the new user search
      const mockCreatedSearch = {
        email: req.body.email,
        countries: req.body.countries,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
      };
      UserSearch.create.mockResolvedValue(mockCreatedSearch);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await userSearchController.createUserSearch(req, res);

      expect(UserSearch.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(UserSearch.create).toHaveBeenCalledWith(req.body);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "New user search created successfully",
        data: mockCreatedSearch,
      });
    });

    it("should update an existing user search when email exists", async () => {
      const req = {
        body: {
          email: "existinguser@example.com",
          countries: ["Country C", "Country D"],
          dateFrom: "2022-01-01",
          dateTo: "2022-12-31",
        },
      };

      // Mock findOne to return an existing user search
      const mockExistingSearch = {
        email: req.body.email,
        countries: ["Old Country"],
        dateFrom: "2020-01-01",
        dateTo: "2020-12-31",
        update: jest.fn(),
      };
      UserSearch.findOne.mockResolvedValue(mockExistingSearch);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await userSearchController.createUserSearch(req, res);

      expect(UserSearch.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(mockExistingSearch.update).toHaveBeenCalledWith({
        countries: req.body.countries,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User search updated successfully",
        data: mockExistingSearch,
      });
    });

    it("should return 400 if email is missing", async () => {
      const req = {
        body: {
          countries: ["Country A", "Country B"],
          dateFrom: "2021-01-01",
          dateTo: "2021-12-31",
        },
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await userSearchController.createUserSearch(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email is required" });
    });

    it("should handle errors during creation", async () => {
      const req = {
        body: {
          email: "erroruser@example.com",
          countries: ["Country A", "Country B"],
          dateFrom: "2021-01-01",
          dateTo: "2021-12-31",
        },
      };

      UserSearch.findOne.mockRejectedValue(new Error("Database error"));

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await userSearchController.createUserSearch(req, res);

      expect(UserSearch.findOne).toHaveBeenCalledWith({
        where: { email: req.body.email },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error: Error processing user search",
      });
    });
  });

  describe("getUserSearchesByEmail", () => {
    it("should return user searches for a valid email", async () => {
      const req = {
        query: {
          email: "test@example.com",
        },
      };

      const mockSearches = {
        email: "test@example.com",
        countries: ["Country A", "Country B"],
        dateFrom: "2021-01-01",
        dateTo: "2021-12-31",
      };

      UserSearch.findOne.mockResolvedValue(mockSearches);

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await userSearchController.getUserSearchesByEmail(req, res);

      expect(UserSearch.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSearches);
    });

    it("should handle missing email parameter", async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await userSearchController.getUserSearchesByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email is required" });
    });

    it("should handle errors", async () => {
      const req = {
        query: {
          email: "test@example.com",
        },
      };

      UserSearch.findOne.mockRejectedValue(new Error("Database error"));

      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await userSearchController.getUserSearchesByEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Internal server error: Error fetching user searches",
      });
    });
  });
});
