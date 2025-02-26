import { TypeForm } from "../TypeForm";
import { TypeInfoProps } from "./TypeInfo.interface";


export function TypeInfo(props: TypeInfoProps) {
    const { type } = props
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 gap-y-4">
        <div className="rounded-lg bg-background shadow-md hover:shadow-lg">
            <div>
                <TypeForm type={ type }/>
            </div>
        </div>
    </div>
  )
}
