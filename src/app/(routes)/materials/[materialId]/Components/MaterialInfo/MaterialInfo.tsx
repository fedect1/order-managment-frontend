import { MaterialForm } from "../MaterialForm";
import { MaterialInfoProps } from "./MaterialInfo.interface";

export function MaterialInfo(props: MaterialInfoProps) {
    const { material } = props
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
        <div className="rounded-lg bg-background shadow-md hover:shadow-lg">
            <div>
                <MaterialForm material={material}/>
            </div>
        </div>
    </div>
  )
}
