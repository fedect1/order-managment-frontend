import { Dispatch, SetStateAction } from "react";

export interface LineData {
    LINE_ID: number,
    LINE_COLOUR: bigint,
    LINE_NAME: string
}

export interface FormCreateOrderProps {
  setOpenModalCreate: Dispatch<SetStateAction<boolean>>;
  lineList: LineData[];
}