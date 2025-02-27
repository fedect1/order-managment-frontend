import { HeaderCharge } from "./components/charges";
import { SiloSummary } from "./components/silos/SiloSummary";
import { dataSiloSummary } from "./components/silos/SiloSummary/SiloSummary.data";
import { HeaderSilo } from "./components/silos";


export default function ChargesPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-x-10"> 
        <div className="lg:col-span-2 pr-2 lg:border-r lg:border-gray-300">
          <HeaderSilo/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
                {
                    dataSiloSummary.map(({ SILO_SILO, SILO_NAME, SILO_QUANTITY, SILO_CHARGE, SILO_CAPACITY, RAWMAT_NAME, RAWMAT_RAWTYP  }) => (
                    <SiloSummary
                    key={SILO_SILO}
                    SILO_SILO={SILO_SILO}
                    SILO_NAME={SILO_NAME}
                    SILO_QUANTITY={SILO_QUANTITY}
                    SILO_CHARGE={SILO_CHARGE}
                    SILO_CAPACITY={SILO_CAPACITY}
                    RAWMAT_NAME={RAWMAT_NAME}
                    RAWMAT_RAWTYP={RAWMAT_RAWTYP}
                    />
                    ))
                }
            </div>
        </div>
        <div className="lg:col-span-1">
          <HeaderCharge/>
        </div>
    </div>
  )
}
