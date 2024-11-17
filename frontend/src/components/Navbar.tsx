import { useRootStore } from "@/store/store";
import DateSelector from "./DateSelector";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const { countries, userEmail } = useRootStore((state) => state);

  return (
    <nav className="w-full p-4 flex items-center justify-between gap-5">
      <span className="font-bold text-lg">Covid Tracker</span>
      <div className="flex flex-row items-center gap-5">
        <SearchBar />
        <DateSelector />
      </div>
      {userEmail.length > 0 && (
        <div className="font-semibold text-sm">Email: {userEmail}</div>
      )}
    </nav>
  );
};

export default Navbar;
