import { FormCreateRecipeProps } from "./FormCreateRecipe.interface";

export function FormCreateRecipe(props: FormCreateRecipeProps) {
    const { lines } = props;
    console.log(lines);
    return (
        <div>FormCreateRecipe</div>
    );
}