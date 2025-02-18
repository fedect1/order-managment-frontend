import { CardSummary } from "./components/CardSummary";
import { BookOpenCheck, UserRound, Waypoints } from "lucide-react";

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
    </div>
  );
}
