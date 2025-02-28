import { CustomIcon } from "@/components/CustomIcon";
import { Building } from "lucide-react";
import { CustomersTable } from "../CustomerTable";

export default function LastCustomers() {
  return (
    <div className="shadow-sm bg-background rounded-lg p-5">
        <div className="flex gap-x-2 items-center">
            <CustomIcon icon={ Building }/>
            <p> Silos </p>
        </div>
        <div className="">
            <CustomersTable/>
        </div>
    </div>
  )
}
