import { useRootStore } from "@/store/store";
import { XIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import { saveUserSearch } from "@/api/getApis";

const Filters = () => {
  const { countries, setCountries, userEmail } = useRootStore((state) => state);

  return (
    <div>
      <div className="flex flex-row flex-wrap gap-2 pb-4">
        {countries.map((country) => (
          <Badge
            key={country}
            className="flex flex-row gap-2 w-max rounded-full border border-gray-200"
            variant="secondary"
          >
            <span>{country}</span>
            <XIcon
              className="h-4 w-4 cursor-pointer hover:text-red-500"
              onClick={async () => {
                setCountries(
                  countries.filter(
                    (currentCountry) => currentCountry !== country
                  )
                );
                await saveUserSearch(
                  userEmail,
                  countries.filter(
                    (currentCountry) => currentCountry !== country
                  )
                );
              }}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default Filters;
