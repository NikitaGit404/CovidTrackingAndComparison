import { getCountries, saveUserSearch } from "@/api/getApis";
import { useApi } from "@/hooks/useApi";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import cn from "classnames";
import { useRootStore } from "@/store/store";

const SearchBar = () => {
  const { countries, setCountries, userEmail } = useRootStore((state) => state);
  const [openSearchBox, setOpenSearchBox] = useState(false);
  const [countryValue, setCountryValue] = useState("");
  const { data, loading, error } = useApi(getCountries, []);

  return (
    !loading &&
    !error && (
      <div className="flex flex-row items-center gap-2">
        <Popover open={openSearchBox} onOpenChange={setOpenSearchBox}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSearchBox}
              className="w-[300px] justify-between"
            >
              {countryValue ? countryValue : "Add country"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {data?.map((currentData) => (
                    <CommandItem
                      key={currentData}
                      value={currentData}
                      className="cursor-pointer"
                      onSelect={async (currentValue) => {
                        setOpenSearchBox(false);
                        if (!countries.includes(currentValue)) {
                          const tempCountries = [...countries, currentValue];
                          setCountries(tempCountries);
                          setCountryValue("");
                          if (userEmail)
                            await saveUserSearch(userEmail, tempCountries);
                        }
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          countries.includes(currentData)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {currentData}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    )
  );
};

export default SearchBar;
