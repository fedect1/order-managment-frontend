// import LastCustomers from "./components/LastCustomers/LastCustomers";
// import SalesDistributors from './components/SalesDistributors/SalesDistributors';
import { dataLineSummary } from "./components/LineSummary/LineSummary.data";
import { LineSummary } from "./components/LineSummary";

export default function Home() {
  return (
    <div>
      <h2 className="text-2xl mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-x-20">
        {
          dataLineSummary.map(({ line, color, status, lastOrder, currentOrder, followingOrder, amountAct, amountTgt, throughputAct, throughputTgt, TooltipInfo }) => (
            <LineSummary
              key={line}
              line={line}
              color={color}
              status={status}
              lastOrder={lastOrder}
              currentOrder={currentOrder}
              followingOrder={followingOrder}
              amountAct={amountAct}
              amountTgt={amountTgt}
              throughputAct={throughputAct}
              throughputTgt={throughputTgt}
              TooltipInfo={TooltipInfo}
            />
          ))
        }
      </div>
      {/* <div className="grid grid-cols-1 xl:grid-cols-2 md:gap-x-10 mt-12">
        <LastCustomers />
        <SalesDistributors />
      </div> */}
    </div>
  );
}