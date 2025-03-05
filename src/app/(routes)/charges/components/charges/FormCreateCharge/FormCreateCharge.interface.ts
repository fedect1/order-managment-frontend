import { Dispatch, SetStateAction } from "react";

export interface FormCreateChargeProps {
    setOpenModalCreate: Dispatch<SetStateAction<boolean>>;
    materials: {
        RAWMAT_RAWMAT: number;
        RAWMAT_NAME: string;
        RAWMAT_COLOR: number | bigint;
        RAWMAT_DENSITY: number;
    }[];
}