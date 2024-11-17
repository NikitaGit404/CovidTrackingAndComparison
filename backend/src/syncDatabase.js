const sequelize = require("./config/database");
const CovidData = require("./models/CovidData");
const UserSearch = require("./models/UserSearch");

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected...");

    // Synchronize all models
    await sequelize.sync({ force: false }); // Warning: This will drop the table if it exists
    console.log("All models were synchronized successfully.");

    process.exit(0); // Exit the process
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // Exit with error
  }
})();
