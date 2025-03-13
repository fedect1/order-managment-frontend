// FormCreateRecipe.interface.ts

// Interfaz para los materiales que vienen de la API
export interface Material {
  RAWMAT_RAWMAT: number;
  RAWMAT_SHORT: string;
  // ... otros campos según sea necesario
}

// Interfaz para representar un dosificador
export interface Dosifier {
  id: number;
  materialId: number | null;
  material: string | null;
  percentage: number;
}

// Interfaz para representar una capa
export interface Layer {
  id: string;
  name: string;
  percentage: number;
  dosifiers: Dosifier[];
}

// Interfaz para los datos de la receta completa
export interface RecipeData {
  uuid?: string;
  name: string;
  layers: Layer[];
}

// Interfaz para las props del formulario
export interface FormCreateRecipeProps {
  materials: Material[];
  existingRecipe?: RecipeData; // Para modo edición
  isEditing?: boolean; // Flag para diferenciar creación y edición
  recipeUuid?: string; // UUID para editar
  onSaveSuccess?: () => void; // Callback después de guardar exitosamente
}