// Agregar esta interfaz después de las interfaces Layer y Dosifier
export interface RecipeEntry {
    RECIPE_REZPNR_UNI: string;
    RECIPE_SCHICHT: string;
    RECIPE_SCHICHT_ANTEIL: number;
    RECIPE_REZPNR_MAT: string;
    RECIPE_COMPONENT: number;
    RECIPE_MATERIAL: string | null;
    RECIPE_MATERIAL_ID: string | null;
    RECIPE_DICHTE: number | null;
    RECIPE_MATERIAL_ANTEIL: number;
    RECIPE_ROHSTOFF: string | null;
  }