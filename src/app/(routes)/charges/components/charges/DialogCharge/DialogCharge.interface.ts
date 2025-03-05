export interface DialogChargeProps {
  materials: {
    RAWMAT_RAWMAT: number;
    RAWMAT_NAME: string;
    RAWMAT_COLOR: number | bigint; // Permite tanto number como bigint
    RAWMAT_DENSITY: number;
  }[];
}

// Interfaz para FormCreateCharge si es necesario
export interface FormCreateChargeProps {
  setOpenModalCreate: (open: boolean) => void;
  materials: {
    RAWMAT_RAWMAT: number;
    RAWMAT_NAME: string;
    RAWMAT_COLOR: number | bigint; // Permite tanto number como bigint
    RAWMAT_DENSITY: number;
  }[];
}