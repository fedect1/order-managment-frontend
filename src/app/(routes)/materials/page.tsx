import { HeaderMaterial } from "./components/HeaderMaterial";
import { HeaderType } from "./components/HeaderType";

export default function MaterialsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-x-10"> 
        <div className="lg:col-span-2 pr-2 lg:border-r lg:border-gray-300">
          <HeaderMaterial/>
        </div>
        <div className="lg:col-span-1">
          <HeaderType/>
        </div>
    </div>
  )
}
