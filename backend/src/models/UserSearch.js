const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserSearch = sequelize.define(
  "UserSearch",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    countries: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Stores an array of country names
      allowNull: true,
    },
    dateFrom: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    dateTo: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "user_search", // Name of the table in the database
    timestamps: false, // Disable createdAt and updatedAt timestamps
  }
);

module.exports = UserSearch;
