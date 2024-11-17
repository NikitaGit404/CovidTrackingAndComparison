import Filters from "./components/Filters";
import LineChartComponent from "./components/LineChartComponent";
import Navbar from "./components/Navbar";
import HeatMapChart from "./components/HeatMapChart";
import WorldMap from "./components/WorldMap";
import { useRootStore } from "./store/store";
import RadialAndBarCharts from "./components/RadialAndBarCharts";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import { useApi } from "./hooks/useApi";
import { getUserSearches } from "./api/getApis";

const App = () => {
  const { userEmail, setCountries, setDateFrom, setDateTo, setUserEmail } =
    useRootStore((state) => state);
  const [email, setEmail] = useState("");
  const [openModal, setOpenModal] = useState(true);

  const { data } = useApi(() => {
    if (userEmail) {
      return getUserSearches(userEmail);
    }
    return Promise.resolve(undefined);
  }, [userEmail]);

  useEffect(() => {
    if (data) {
      setCountries(data?.countries);
      if (data.dateFrom) setDateFrom(new Date(`${data.dateFrom}T00:00:00`));
      else setDateFrom(null);
      if (data.dateTo) setDateTo(new Date(`${data.dateTo}T00:00:00`));
      else setDateTo(null);
    }
  }, [data]);

  return (
    <div className="px-4">
      <Navbar />
      <Filters />
      <LineChartComponent />
      <RadialAndBarCharts />
      <WorldMap />
      <HeatMapChart />
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email</DialogTitle>
            <DialogDescription>
              Please provide your email to save your searches.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Input
                id="email"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setUserEmail(email);
                }}
              >
                Submit
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
