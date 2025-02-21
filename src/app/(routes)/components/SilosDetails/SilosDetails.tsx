import { CustomIcon } from "@/components/CustomIcon";
import { ChartNoAxesColumn } from "lucide-react";
import { CustomersTable } from "../CustomerTable";

export default function SilosDetails() {
  return (
    <div className="shadow-sm bg-background rounded-lg p-5">
        <div className="flex gap-x-2 items-center">
            <CustomIcon icon={ ChartNoAxesColumn }/>
            <p> Silos details </p>
        </div>
        <div className="">
            <CustomersTable/>
        </div>
    </div>
  )
}
