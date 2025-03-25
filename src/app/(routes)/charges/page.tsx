import { HeaderCharge } from "./components/charges";
import { SiloSummary } from "./components/silos/SiloSummary";
import { dataSiloSummary } from "./components/silos/SiloSummary/SiloSummary.data";
import { HeaderSilo } from "./components/silos";
import { ListCharges } from "./components/charges/ListCharges";
import { BulkContainer } from "@/components/BulkContainer";


export default function ChargesPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-1 lg:gap-x-5"> 
        <div className="lg:col-span-3 pr-2 lg:border-r lg:border-gray-300">
          <HeaderSilo/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-x-3">
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
        <div className="lg:col-span-3">
          <HeaderCharge/>
          <ListCharges/>
        </div>
               
        <div style={{ width: '200px', height: '250px', display: 'inline-block', margin: '10px' }}>
        <BulkContainer
          fillPercentage={50} 
          name="Bulk 1" 
          color="green" 
        />
        </div>
        <div style={{ width: '200px', height: '250px', display: 'inline-block', margin: '10px' }}>
        <BulkContainer
          fillPercentage={10} 
          name="Bulk 2" 
          color="blue" 
        />
        </div>
        <div style={{ width: '200px', height: '250px', display: 'inline-block', margin: '10px' }}>
        <BulkContainer
          fillPercentage={70} 
          name="Bulk 3" 
          color="yellow" 
        />
        </div>
    </div>
  )
}
