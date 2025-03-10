
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface ListTypesProps {
  rawTypes: {
    RAWTYP_RAWTYP: number;
    RAWTYP_SHORT: string;
    RAWTYP_DESC: string | null;
  }[];
}

export async function ListTypes({ rawTypes }: ListTypesProps) {
    const sortedTypes = [...rawTypes].sort((a, b) => b.RAWTYP_RAWTYP - a.RAWTYP_RAWTYP);
    return (
      <DataTable columns={columns} data={sortedTypes}/>
    )
  }
  