"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { t_rawmat } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"

// Función para convertir un número decimal a color hexadecimal
const decimalToHex = (decimal: bigint | number): string => {
  // Convertir a número si es BigInt
  const colorNumber = typeof decimal === 'bigint' ? Number(decimal) : decimal;
  
  // Convertir a hex y agregar el prefijo #
  return `#${colorNumber.toString(16).padStart(6, '0')}`;
};

export const columns: ColumnDef<t_rawmat>[] = [
    {
        accessorKey: "RAWMAT_COLOR",
        header: "Kolor",
        cell: ({ row }) => {
            const colorValue = row.original.RAWMAT_COLOR;
            const hexColor = decimalToHex(colorValue);
            
            return (
                <div className="flex items-center space-x-2">
                    <div 
                        className="w-6 h-6 rounded-full border border-gray-300" 
                        style={{ backgroundColor: hexColor }}
                    />
                </div>
            );
        }
    },
    {
        accessorKey: "RAWMAT_RAWMAT",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="m-0 p-0 flex items-center" onClick={ () => column.toggleSorting(column.getIsSorted()==="desc")}>
                    Klucz
                    <ArrowUpDown className="w-4 h-4 ml-2"/>
                </Button>
            )
        }
    },
    {
        accessorKey: "RAWMAT_NAME",
        header: "Nazwa"
    },
    {
        accessorKey: "RAWMAT_DENSITY",
        header: "Gęstość g/cm³"
    },
    {
        accessorKey: "RAWMAT_MFIVAL",
        header: "Wartość MFI"
    },
    {
        accessorKey: "RAWMAT_BULKDENS",
        header: "Gęstość nasypowa"
    },
    {
        accessorKey: "RAWMAT_RAWTYP",
        header: "Typ"
    },
    {
        accessorKey: "RAWMAT_ARTN",
        header: "Artykuł"
    },
    {
        id: "actions",
        header: "Akcje",
        cell: ({ row }) => {
            const { RAWMAT_RAWMAT } = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-4 p-0">
                            <MoreHorizontal className="w-4 h-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/materials/${RAWMAT_RAWMAT}`}>
                            <DropdownMenuItem>
                                <Pencil className="w-4 h-4 mr-2"/>
                                Edit
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]