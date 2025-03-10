import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ typeId: string }> }
) {
  try {
    // En Next.js 14, params es una promesa que debe ser esperada
    const resolvedParams = await params;
    const typeId = parseInt(resolvedParams.typeId);
    
    if (isNaN(typeId)) {
      return NextResponse.json(
        { error: "Invalid type ID format" },
        { status: 400 }
      );
    }

    // Check if the type exists
    const existingType = await prisma.t_rawtyp.findUnique({
      where: { RAWTYP_RAWTYP: typeId }
    });

    if (!existingType) {
      return NextResponse.json(
        { error: "Type not found" },
        { status: 404 }
      );
    }

    // Check if any materials are using this type
    const materialsUsingType = await prisma.t_rawmat.findMany({
      where: { RAWMAT_RAWTYP: typeId },
      take: 1 // We only need to know if any exist
    });

    // Perform soft delete by updating the RAWTYP_DELETED field
    const updatedType = await prisma.t_rawtyp.update({
      where: { RAWTYP_RAWTYP: typeId },
      data: { RAWTYP_DELETED: true }
    });

    // Return how many materials are affected by this change
    // This is useful information for the frontend
    return NextResponse.json({
      success: true,
      message: "Type marked as deleted",
      affectedMaterials: materialsUsingType.length,
      type: updatedType
    });

  } catch (error) {
    console.error("Error deleting type:", error);
    return NextResponse.json(
      { error: "Failed to delete type" },
      { status: 500 }
    );
  }
}