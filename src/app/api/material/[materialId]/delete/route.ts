import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { t_rawmat } from "@prisma/client";

// Tipo para el material serializado (con RAWMAT_COLOR como string en lugar de BigInt)
type SerializedMaterial = Omit<t_rawmat, 'RAWMAT_COLOR'> & {
  RAWMAT_COLOR: string;
};

// Función para convertir BigInt a String en el objeto material
const serializeMaterial = (material: t_rawmat): SerializedMaterial => {
  const { RAWMAT_COLOR, ...rest } = material;
  return {
    ...rest,
    RAWMAT_COLOR: RAWMAT_COLOR.toString()
  };
};

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ materialId: string }> }
) {
  try {
    // En Next.js 14, params es una promesa que debe ser esperada
    const resolvedParams = await params;
    const materialId = parseInt(resolvedParams.materialId);
    
    if (isNaN(materialId)) {
      return NextResponse.json(
        { error: "Invalid material ID format" },
        { status: 400 }
      );
    }

    // Check if the material exists
    const existingMaterial = await prisma.t_rawmat.findUnique({
      where: { RAWMAT_RAWMAT: materialId }
    });

    if (!existingMaterial) {
      return NextResponse.json(
        { error: "Material not found" },
        { status: 404 }
      );
    }

    // Perform soft delete by updating the RAWMAT_DELETED field
    const updatedMaterial = await prisma.t_rawmat.update({
      where: { RAWMAT_RAWMAT: materialId },
      data: { RAWMAT_DELETED: true }
    });

    // Serializar el material para manejar el campo BigInt
    const serializedMaterial = serializeMaterial(updatedMaterial);

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Material marked as deleted",
      material: serializedMaterial
    });

  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { error: "Failed to delete material" },
      { status: 500 }
    );
  }
}