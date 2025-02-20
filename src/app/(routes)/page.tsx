import { CardSummary } from "./components/CardSummary";
import { BookOpenCheck, UserRound, Waypoints } from "lucide-react";
import LastCustomers from "./components/LastCustomers/LastCustomers";
import SalesDistributors from './components/SalesDistributors/SalesDistributors';
import { TotalSuscribers } from "./components/TotalSuscribers";
import { ListIntegrations } from "./components/ListIntegrations";


export const dataCardsSummary = [
  {
    icon: UserRound,
    total: "12,154",
    average: 15,
    title: "Raw material",
    tooltipText: "See al the materials",
  },
  {
    icon: Waypoints,
    total: "86.5",
    average: 80,
    title: "Production",
    tooltipText: "See the production",
  },
  {
    icon: BookOpenCheck,
    total: "363.95",
    average: 30,
    title: "Current orders",
    tooltipText: "See al the Current materials",
  },
]

export default function Home() {
  return (
    <div >
      <h2 className="text-2xl mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
          {
            dataCardsSummary.map(({ icon, total, average, title, tooltipText }) => (
              <CardSummary
              key={title}
              title={title}
              icon={icon}
              total={total}
              average={average}
              tooltipText={tooltipText}
              />
            ))
          }
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 md:gap-x-10 mt-12">
          <LastCustomers/>
          <SalesDistributors/>
      </div>
      <div className="flex-col xl:flex xl:flex-row md:gap-x-10 gap-y-4 md:gap-y-0 mt-12 md:mb-10 justify-center">
        <TotalSuscribers/>
        <ListIntegrations/>
      </div>
    </div>
  );
}
