import httpClient from "./httpClient";

export const getCountries = async (): Promise<string[]> => {
  const response = await httpClient.get<string[]>("/countries");
  return response.data;
};

interface CountryData {
  date: string; // Explicitly define the date property
  [countryName: string]: string | number; // Allow dynamic country keys with numeric values
}

interface WorldMapData {
  country: string;
  total: number;
}

export const getCountryCases = async (
  dateFrom?: string,
  dateTo?: string,
  countries?: string[],
  column?: string
): Promise<CountryData[]> => {
  const response = await httpClient.get<CountryData[]>("/country-cases", {
    params: {
      dateFrom: dateFrom,
      dateTo: dateTo,
      countries: countries,
      column: column,
    },
  });
  return response.data;
};

interface TotalCasesData {
  country: string;
  total: number;
  code: string;
}
export const getTotalCases = async (
  column?: string
): Promise<TotalCasesData[]> => {
  const response = await httpClient.get<TotalCasesData[]>("/total-cases", {
    params: {
      column: column,
    },
  });
  return response.data;
};

interface VaccinationData {
  country: string;
  percentage: number;
  avgLifeExpectancy: number;
}
export const getVaccinationPercentage = async (
  countries?: string[]
): Promise<VaccinationData[]> => {
  const response = await httpClient.get<VaccinationData[]>("/vaccination-per", {
    params: {
      countries: countries,
    },
  });
  return response.data;
};

interface SearchData {
  email: string;
  countries: string[];
  dateFrom: string;
  dateTo: string;
}

export const getUserSearches = async (email: string): Promise<SearchData> => {
  const response = await httpClient.get<SearchData>("/get-user-searches", {
    params: {
      email: email,
    },
  });
  return response.data;
};

export const saveUserSearch = async (
  email: string,
  countries?: string[],
  dateFrom?: Date,
  dateTo?: Date
): Promise<void> => {
  await httpClient.post("/create-user-search", {
    email: email,
    countries: countries,
    dateFrom: dateFrom,
    dateTo: dateTo,
  });
};
