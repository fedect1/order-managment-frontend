export interface MaterialData {
    RAWMAT_RAWMAT: number,
    RAWMAT_SHORT: string | null,
    RAWMAT_COLOR: bigint,
    RAWMAT_DENSITY: number
  }
  
  export interface FormCreateRecipeProps {
    materials: MaterialData[];
  }