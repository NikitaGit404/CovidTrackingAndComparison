const { Op, Sequelize } = require("sequelize");
const CovidData = require("../models/CovidData");

//list all countries
exports.getCountries = async (req, res) => {
  try {
    const countries = await CovidData.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("country")), "country"],
      ],
      order: [[Sequelize.col("country"), "ASC"]],
    });

    // Transform the result into an array of country names
    const countryList = countries.map((item) => item.get("country"));

    res.status(200).json(countryList);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error: Error fetching countries" });
  }
};

exports.getCasesByCountry = async (req, res) => {
  try {
    const { dateFrom, dateTo, countries: countriesRaw, column } = req.query;

    if (!column) {
      return res.status(400).json({ error: "Column is required" });
    }

    let countries = [];
    if (countriesRaw) {
      try {
        // Parse `countries` if it's a JSON string
        countries =
          typeof countriesRaw === "string"
            ? JSON.parse(countriesRaw)
            : countriesRaw;
      } catch (error) {
        console.error("Error parsing countries parameter:", error);
        return res
          .status(400)
          .json({ error: "Invalid format for countries parameter" });
      }
    }

    if (countries.length === 0) {
      return res
        .status(400)
        .json({ error: "Countries must be a non-empty array" });
    }

    // Build query conditions
    const conditions = {
      country: {
        [Op.in]: countries,
      },
    };

    // Optional date range filtering
    if (dateFrom && dateTo) {
      conditions.date = {
        [Op.between]: [dateFrom, dateTo],
      };
    } else if (dateFrom) {
      conditions.date = {
        [Op.gte]: dateFrom,
      };
    } else if (dateTo) {
      conditions.date = {
        [Op.lte]: dateTo,
      };
    }

    // Fetch data from the database
    const data = await CovidData.findAll({
      where: conditions,
      attributes: ["date", column, "country"], // Dynamically fetch the requested column
      order: [
        ["date", "ASC"],
        ["country", "ASC"],
      ],
    });

    // Transform data into the desired format
    const groupedData = {};
    data.forEach((record) => {
      const { date, country } = record;
      if (!groupedData[date]) {
        groupedData[date] = { date };
      }
      groupedData[date][country] = record[column] || 0; // Assign country's column value
    });

    // Convert grouped data into an array
    const responseData = Object.values(groupedData);

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching data for country new cases:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMaxCasesByCountry = async (req, res) => {
  try {
    const { column } = req.query;

    if (!column) {
      return res.status(400).json({ error: "Column is required" });
    }

    // Fetch data from the database
    const data = await CovidData.findAll({
      attributes: [
        "country",
        "code",
        [Sequelize.fn("MAX", Sequelize.col(column)), column], // Compute max value for the specified column
      ],
      group: ["country", "code"], // Group by country
    });

    // Transform data into the desired format
    const responseData = data.map((row) => {
      const result = row.toJSON();
      const country = result.country;
      const maxValue = result[column] || 0; // Default to 0 if no value found
      const code = result.code;
      return { country, code, total: maxValue };
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching max cases by country:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getVaccinationPercentage = async (req, res) => {
  try {
    const { countries } = req.query;

    if (!countries) {
      return res.status(400).json({ error: "Countries parameter is required" });
    }

    let countryList = [];
    try {
      // Parse the countries parameter as JSON
      countryList =
        typeof countries === "string" ? JSON.parse(countries) : countries;
    } catch (error) {
      console.error("Error parsing countries parameter:", error);
      return res
        .status(400)
        .json({ error: "Invalid format for countries parameter" });
    }

    if (!Array.isArray(countryList) || countryList.length === 0) {
      return res
        .status(400)
        .json({ error: "Countries must be a non-empty array" });
    }

    // Fetch data from the database
    const data = await CovidData.findAll({
      where: {
        country: {
          [Sequelize.Op.in]: countryList,
        },
      },
      attributes: [
        "country",
        [
          Sequelize.fn("MAX", Sequelize.col("people_vaccinated")),
          "maxVaccinated",
        ], // Max vaccinated
        "population", // Population
        [
          Sequelize.fn("AVG", Sequelize.col("life_expectancy")),
          "avgLifeExpectancy",
        ],
      ],
      group: ["country", "population"], // Group by country and population
    });

    // Calculate percentage and transform the data
    const responseData = data.map((row) => {
      const result = row.toJSON();
      const country = result.country;
      const maxVaccinated = result.maxVaccinated || 0; // Default to 0 if no value found
      const population = result.population || 1; // Avoid division by zero
      const percentage = ((maxVaccinated / population) * 100).toFixed(2); // Calculate percentage
      const avgLifeExpectancy = result.avgLifeExpectancy
        ? parseFloat(result.avgLifeExpectancy.toFixed(2))
        : null;

      return { country, percentage: parseFloat(percentage), avgLifeExpectancy };
    });

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      error: "Internal server error: Error fetching vaccination percentages",
    });
  }
};
