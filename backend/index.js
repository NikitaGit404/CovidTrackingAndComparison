const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const sequelize = require("./src/config/database");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Database connection error:", err));

// Define routes
app.use("/api", require("./src/routes/covidData"));

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
