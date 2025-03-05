"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { t_rawcharge } from "@prisma/client" // Importamos el modelo correcto
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"

// Usamos t_rawcharge como tipo para las columnas
export const columns: ColumnDef<t_rawcharge>[] = [
    {
        accessorKey: "RAWCHARGE_RAWCHARGE",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="m-0 p-0 flex items-center" onClick={ () => column.toggleSorting(column.getIsSorted()==="asc")}>
                    Key
                    <ArrowUpDown className="w-4 h-4 ml-2"/>
                </Button>
            )
        }
    },
    {
        accessorKey: "RAWCHARGE_RAWMAT",
        header: "RAWMAT"
    },
    {
        accessorKey: "RAWCHARGE_CHARGENR",
        header: "CHARGE"
    },
    {
        accessorKey: "RAWCHARGE_DATIM",
        header: "DATE",
        cell: ({ row }) => {
          const rawValue = row.getValue("RAWCHARGE_DATIM");
          
          // Validamos y convertimos el valor a un tipo que Date pueda aceptar
          if (rawValue === null || rawValue === undefined) {
            return "N/A";
          }
          
          // Convertir explícitamente a string o number para satisfacer TypeScript
          const dateValue = typeof rawValue === 'string' || typeof rawValue === 'number' 
            ? rawValue 
            : String(rawValue);
          
          try {
            const date = new Date(dateValue);
            
            // Verificar si la fecha es válida
            if (isNaN(date.getTime())) {
              return "Invalid Date";
            }
            
            // Formateamos manualmente para obtener "Feb 27 2025 13:40:30"
            const month = date.toLocaleString("en-US", { month: "short" });
            const day = date.getDate();
            const year = date.getFullYear();
            const time = date.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            
            return `${month} ${day} ${year} ${time}`;
          } catch (error) {
            console.error("Error formatting date:", error);
            return "Error";
          }
        },
    },
    {
        accessorKey: "RAWCHARGE_AMOUNT",
        header: "AMOUNT"
    },
    {
        accessorKey: "RAWCHARGE_ACTAMOUNT",
        header: "ACT AMOUNT"
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const { RAWCHARGE_RAWCHARGE } = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-4 p-0">
                            <MoreHorizontal className="w-4 h-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/charges/${RAWCHARGE_RAWCHARGE}`}>
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