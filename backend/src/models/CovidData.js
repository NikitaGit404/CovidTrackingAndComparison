const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CovidData = sequelize.define(
  "CovidData",
  {
    country: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    total_cases: DataTypes.FLOAT,
    new_cases: DataTypes.FLOAT,
    new_cases_smoothed: DataTypes.FLOAT,
    total_cases_per_million: DataTypes.FLOAT,
    new_cases_per_million: DataTypes.FLOAT,
    new_cases_smoothed_per_million: DataTypes.FLOAT,
    total_deaths: DataTypes.FLOAT,
    new_deaths: DataTypes.FLOAT,
    new_deaths_smoothed: DataTypes.FLOAT,
    total_deaths_per_million: DataTypes.FLOAT,
    new_deaths_per_million: DataTypes.FLOAT,
    new_deaths_smoothed_per_million: DataTypes.FLOAT,
    excess_mortality: DataTypes.FLOAT,
    excess_mortality_cumulative: DataTypes.FLOAT,
    excess_mortality_cumulative_absolute: DataTypes.FLOAT,
    excess_mortality_cumulative_per_million: DataTypes.FLOAT,
    hosp_patients: DataTypes.FLOAT,
    hosp_patients_per_million: DataTypes.FLOAT,
    weekly_hosp_admissions: DataTypes.FLOAT,
    weekly_hosp_admissions_per_million: DataTypes.FLOAT,
    icu_patients: DataTypes.FLOAT,
    icu_patients_per_million: DataTypes.FLOAT,
    weekly_icu_admissions: DataTypes.FLOAT,
    weekly_icu_admissions_per_million: DataTypes.FLOAT,
    stringency_index: DataTypes.FLOAT,
    reproduction_rate: DataTypes.FLOAT,
    total_tests: DataTypes.FLOAT,
    new_tests: DataTypes.FLOAT,
    total_tests_per_thousand: DataTypes.FLOAT,
    new_tests_per_thousand: DataTypes.FLOAT,
    new_tests_smoothed: DataTypes.FLOAT,
    new_tests_smoothed_per_thousand: DataTypes.FLOAT,
    positive_rate: DataTypes.FLOAT,
    tests_per_case: DataTypes.FLOAT,
    total_vaccinations: DataTypes.FLOAT,
    people_vaccinated: DataTypes.FLOAT,
    people_fully_vaccinated: DataTypes.FLOAT,
    total_boosters: DataTypes.FLOAT,
    new_vaccinations: DataTypes.FLOAT,
    new_vaccinations_smoothed: DataTypes.FLOAT,
    total_vaccinations_per_hundred: DataTypes.FLOAT,
    people_vaccinated_per_hundred: DataTypes.FLOAT,
    people_fully_vaccinated_per_hundred: DataTypes.FLOAT,
    total_boosters_per_hundred: DataTypes.FLOAT,
    new_vaccinations_smoothed_per_million: DataTypes.FLOAT,
    new_people_vaccinated_smoothed: DataTypes.FLOAT,
    new_people_vaccinated_smoothed_per_hundred: DataTypes.FLOAT,
    code: DataTypes.STRING,
    continent: DataTypes.STRING,
    population: DataTypes.FLOAT,
    population_density: DataTypes.FLOAT,
    median_age: DataTypes.FLOAT,
    life_expectancy: DataTypes.FLOAT,
    gdp_per_capita: DataTypes.FLOAT,
    extreme_poverty: DataTypes.FLOAT,
    diabetes_prevalence: DataTypes.FLOAT,
    handwashing_facilities: DataTypes.FLOAT,
    hospital_beds_per_thousand: DataTypes.FLOAT,
    human_development_index: DataTypes.FLOAT,
  },
  {
    tableName: "covid_data", // Name of the table in the database
    timestamps: false, // Disable createdAt and updatedAt timestamps
  }
);
module.exports = CovidData;
