
import { Silo } from "@/components/SiloIcon";
import { SiloSummaryProps } from "./SiloSummary.interface";

export function SiloSummary(props: SiloSummaryProps)  {
    const { SILO_NAME, SILO_QUANTITY, SILO_CHARGE, SILO_CAPACITY, RAWMAT_NAME, RAWMAT_RAWTYP } = props
    const perc =  SILO_QUANTITY / SILO_CAPACITY * 100
  return (
    <div className="shadow-sm bg-background rounded-lg p-5 py-3">
        <div className="flex justify-between py-3 border-b">
            <div className="flex gap-2 items-center">
                <div style={{ width: '200px', height: '250px', display: 'inline-block', margin: '10px' }}>
                    <Silo fillPercentage={perc} name={ SILO_NAME }/>
                </div>
            </div>
        </div>
        <div className="">
            <div className="flex justify-between py-3 border-b">
                <p>Charge</p>
                <p>{SILO_CHARGE}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
                <p>Raw material Types</p>
                <p>{RAWMAT_NAME}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
                <p>Raw material Name</p>
                <p>{RAWMAT_RAWTYP}</p>
            </div>
        </div>
    </div>
  )
}
