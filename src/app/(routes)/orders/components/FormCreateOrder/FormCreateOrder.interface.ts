import { Dispatch, SetStateAction } from "react";

export interface LineData {
    LINE_ID: number,
    LINE_COLOUR: bigint,
    LINE_NAME: string
}

export interface RecipeData {
    RECIPE_UUID: string,
    RECIPE_REZPNR_UNI: string,
}

export interface FormCreateOrderProps {
  setOpenModalCreate: Dispatch<SetStateAction<boolean>>;
  lineList: LineData[];
  recipeList: RecipeData[];
}