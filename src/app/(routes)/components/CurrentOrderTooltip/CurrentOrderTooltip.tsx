import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface TooltipInfoProps {
  job_number: string;
  product_number: string;
  quantity_kg: number;
  consumption_kg_k: number;
  pml_target_g_m: number;
  width_mm: number;
  gusset_mm: number;
}

interface CurrentOrderTooltipProps {
  tooltipInfo: TooltipInfoProps;
}

export function CurrentOrderTooltip({ tooltipInfo }: CurrentOrderTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info strokeWidth={1} className="h-4 w-4 text-gray-500" />
        </TooltipTrigger>
        <TooltipContent className="w-64 p-3">
          <div className="space-y-2">
            <h4 className="font-medium text-sm border-b pb-1">Order Details</h4>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
              <p className="text-gray-500">Job Number:</p>
              <p className="font-medium">{tooltipInfo.job_number}</p>
              
              <p className="text-gray-500">Product Number:</p>
              <p className="font-medium">{tooltipInfo.product_number}</p>
              
              <p className="text-gray-500">Quantity:</p>
              <p className="font-medium">{tooltipInfo.quantity_kg} kg</p>
              
              <p className="text-gray-500">Consumption:</p>
              <p className="font-medium">{tooltipInfo.consumption_kg_k} kg/h</p>
              
              <p className="text-gray-500">Target Weight:</p>
              <p className="font-medium">{tooltipInfo.pml_target_g_m} g/m</p>
              
              <p className="text-gray-500">Width:</p>
              <p className="font-medium">{tooltipInfo.width_mm} mm</p>
              
              <p className="text-gray-500">Gusset:</p>
              <p className="font-medium">{tooltipInfo.gusset_mm} mm</p>
              
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}