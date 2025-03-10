import { Dispatch, SetStateAction } from "react";

export interface RawTypeData {
  RAWTYP_RAWTYP: number;
  RAWTYP_SHORT: string;
  RAWTYP_DESC: string | null;
}

export interface FormCreateMaterialProps {
  setOpenModalCreate: Dispatch<SetStateAction<boolean>>;
  rawTypes: RawTypeData[];
}