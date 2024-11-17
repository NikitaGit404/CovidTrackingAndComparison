const { Op, ValidationError } = require("sequelize");
const UserSearch = require("../models/UserSearch");

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

// Helper function to validate date format (YYYY-MM-DD)
const isValidDate = (dateString) => {
  return !isNaN(Date.parse(dateString));
};

// GET user searches by email
exports.getUserSearchesByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    // Validate email presence
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Find searches by email
    const searches = await UserSearch.findOne({
      where: { email },
    });

    // Handle case where no searches are found
    if (!searches) {
      return res
        .status(404)
        .json({ error: "No searches found for the provided email" });
    }

    res.status(200).json(searches);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error: Error fetching user searches" });
  }
};

// POST a new user search
exports.createUserSearch = async (req, res) => {
  const { email, countries, dateFrom, dateTo } = req.body;

  // Validate email presence
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  // Validate countries if provided
  if (countries !== undefined) {
    if (
      !Array.isArray(countries) ||
      countries.some((c) => typeof c !== "string")
    ) {
      return res
        .status(400)
        .json({ error: "'countries' must be an array of strings" });
    }
  }

  // Validate dateFrom if provided
  if (dateFrom !== undefined) {
    if (!isValidDate(dateFrom)) {
      return res.status(400).json({ error: "Invalid 'dateFrom' format" });
    }
  }

  // Validate dateTo if provided
  if (dateTo !== undefined) {
    if (!isValidDate(dateTo)) {
      return res.status(400).json({ error: "Invalid 'dateTo' format" });
    }
  }

  // Ensure dateFrom is before dateTo if both are provided
  if (dateFrom && dateTo) {
    if (new Date(dateFrom) > new Date(dateTo)) {
      return res
        .status(400)
        .json({ error: "'dateFrom' must be before 'dateTo'" });
    }
  }

  try {
    // Find the existing search by email
    let userSearch = await UserSearch.findOne({ where: { email } });

    if (userSearch) {
      // Update only the fields that are provided in the request body
      const updates = {};
      if (countries !== undefined) updates.countries = countries;
      if (dateFrom !== undefined) updates.dateFrom = dateFrom;
      if (dateTo !== undefined) updates.dateTo = dateTo;

      try {
        await userSearch.update(updates);

        return res.status(200).json({
          message: "User search updated successfully",
          data: userSearch,
        });
      } catch (err) {
        console.error("Error updating user search:", err);
        if (err instanceof ValidationError) {
          return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal server error" });
      }
    } else {
      // Create a new entry if the email does not exist
      try {
        const newSearch = await UserSearch.create({
          email,
          countries,
          dateFrom,
          dateTo,
        });

        return res.status(201).json({
          message: "New user search created successfully",
          data: newSearch,
        });
      } catch (err) {
        console.error("Error creating user search:", err);
        if (err instanceof ValidationError) {
          return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error: Error processing user search" });
  }
};
