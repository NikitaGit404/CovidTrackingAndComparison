const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const sequelize = require('./config/database');
const CovidData = require('./models/CovidData');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');

    const BATCH_SIZE = 1000; // Adjust the batch size as needed
    let batch = [];
    const csvFilePath = path.resolve(__dirname, '../data', 'owid_covid_data.csv');

    const stream = fs.createReadStream(csvFilePath);
    const csvStream = csv();

    stream
      .pipe(csvStream)
      .on('data', async (row) => {
        batch.push(transformRow(row));

        if (batch.length >= BATCH_SIZE) {
          // Pause the stream
          stream.pause();

          // Insert the batch
          csvStream.pause(); // Pause the CSV parsing

          try {
            await CovidData.bulkCreate(batch, { ignoreDuplicates: true });
            batch = [];
            // Resume the stream and CSV parsing
            csvStream.resume();
            stream.resume();
          } catch (err) {
            console.error('Error inserting batch:', err);
            stream.destroy(); // Stop processing on error
          }
        }
      })
      .on('end', async () => {
        // Insert any remaining data
        if (batch.length > 0) {
          try {
            await CovidData.bulkCreate(batch, { ignoreDuplicates: true });
          } catch (err) {
            console.error('Error inserting final batch:', err);
          }
        }
        console.log('CSV file successfully processed and all data inserted.');
        sequelize.close();
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
      });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Function to transform and clean data (same as before)
function transformRow(row) {
  return {
    country: row.country || null,
    date: row.date || null,
    total_cases: parseFloatOrNull(row.total_cases),
    new_cases: parseFloatOrNull(row.new_cases),
    new_cases_smoothed: parseFloatOrNull(row.new_cases_smoothed),
    total_cases_per_million: parseFloatOrNull(row.total_cases_per_million),
    new_cases_per_million: parseFloatOrNull(row.new_cases_per_million),
    new_cases_smoothed_per_million: parseFloatOrNull(row.new_cases_smoothed_per_million),
    total_deaths: parseFloatOrNull(row.total_deaths),
    new_deaths: parseFloatOrNull(row.new_deaths),
    new_deaths_smoothed: parseFloatOrNull(row.new_deaths_smoothed),
    total_deaths_per_million: parseFloatOrNull(row.total_deaths_per_million),
    new_deaths_per_million: parseFloatOrNull(row.new_deaths_per_million),
    new_deaths_smoothed_per_million: parseFloatOrNull(row.new_deaths_smoothed_per_million),
    excess_mortality: parseFloatOrNull(row.excess_mortality),
    excess_mortality_cumulative: parseFloatOrNull(row.excess_mortality_cumulative),
    excess_mortality_cumulative_absolute: parseFloatOrNull(row.excess_mortality_cumulative_absolute),
    excess_mortality_cumulative_per_million: parseFloatOrNull(row.excess_mortality_cumulative_per_million),
    hosp_patients: parseFloatOrNull(row.hosp_patients),
    hosp_patients_per_million: parseFloatOrNull(row.hosp_patients_per_million),
    weekly_hosp_admissions: parseFloatOrNull(row.weekly_hosp_admissions),
    weekly_hosp_admissions_per_million: parseFloatOrNull(row.weekly_hosp_admissions_per_million),
    icu_patients: parseFloatOrNull(row.icu_patients),
    icu_patients_per_million: parseFloatOrNull(row.icu_patients_per_million),
    weekly_icu_admissions: parseFloatOrNull(row.weekly_icu_admissions),
    weekly_icu_admissions_per_million: parseFloatOrNull(row.weekly_icu_admissions_per_million),
    stringency_index: parseFloatOrNull(row.stringency_index),
    reproduction_rate: parseFloatOrNull(row.reproduction_rate),
    total_tests: parseFloatOrNull(row.total_tests),
    new_tests: parseFloatOrNull(row.new_tests),
    total_tests_per_thousand: parseFloatOrNull(row.total_tests_per_thousand),
    new_tests_per_thousand: parseFloatOrNull(row.new_tests_per_thousand),
    new_tests_smoothed: parseFloatOrNull(row.new_tests_smoothed),
    new_tests_smoothed_per_thousand: parseFloatOrNull(row.new_tests_smoothed_per_thousand),
    positive_rate: parseFloatOrNull(row.positive_rate),
    tests_per_case: parseFloatOrNull(row.tests_per_case),
    total_vaccinations: parseFloatOrNull(row.total_vaccinations),
    people_vaccinated: parseFloatOrNull(row.people_vaccinated),
    people_fully_vaccinated: parseFloatOrNull(row.people_fully_vaccinated),
    total_boosters: parseFloatOrNull(row.total_boosters),
    new_vaccinations: parseFloatOrNull(row.new_vaccinations),
    new_vaccinations_smoothed: parseFloatOrNull(row.new_vaccinations_smoothed),
    total_vaccinations_per_hundred: parseFloatOrNull(row.total_vaccinations_per_hundred),
    people_vaccinated_per_hundred: parseFloatOrNull(row.people_vaccinated_per_hundred),
    people_fully_vaccinated_per_hundred: parseFloatOrNull(row.people_fully_vaccinated_per_hundred),
    total_boosters_per_hundred: parseFloatOrNull(row.total_boosters_per_hundred),
    new_vaccinations_smoothed_per_million: parseFloatOrNull(row.new_vaccinations_smoothed_per_million),
    new_people_vaccinated_smoothed: parseFloatOrNull(row.new_people_vaccinated_smoothed),
    new_people_vaccinated_smoothed_per_hundred: parseFloatOrNull(row.new_people_vaccinated_smoothed_per_hundred),
    code: row.code || null,
    continent: row.continent || null,
    population: parseFloatOrNull(row.population),
    population_density: parseFloatOrNull(row.population_density),
    median_age: parseFloatOrNull(row.median_age),
    life_expectancy: parseFloatOrNull(row.life_expectancy),
    gdp_per_capita: parseFloatOrNull(row.gdp_per_capita),
    extreme_poverty: parseFloatOrNull(row.extreme_poverty),
    diabetes_prevalence: parseFloatOrNull(row.diabetes_prevalence),
    handwashing_facilities: parseFloatOrNull(row.handwashing_facilities),
    hospital_beds_per_thousand: parseFloatOrNull(row.hospital_beds_per_thousand),
    human_development_index: parseFloatOrNull(row.human_development_index),
  };
}

function parseFloatOrNull(value) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}
