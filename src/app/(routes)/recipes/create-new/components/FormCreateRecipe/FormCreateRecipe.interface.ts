export interface LineData {
    LINE_ID: number,
    LINE_LINE: number,
    LINE_NAME: string,
    LINE_SHORT: string,
    LINE_NDOS: number,
    LINE_NEXT: number
  }

export interface FormCreateRecipeProps {
    lines: LineData[];
}
