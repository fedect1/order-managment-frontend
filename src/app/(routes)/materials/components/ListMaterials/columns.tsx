"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { t_rawmat } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"


export const columns: ColumnDef<t_rawmat>[] = [
    {
        accessorKey: "RAWMAT_COLOR",
        header: "Color"
    },
    {
        accessorKey: "RAWMAT_RAWMAT",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={ () => column.toggleSorting(column.getIsSorted()==="asc")}>
                    Key
                    <ArrowUpDown className="w-4 h-4 ml-2"/>
                </Button>
            )
        }
    },
    {
        accessorKey: "RAWMAT_NAME",
        header: "Name"
    },
    {
        accessorKey: "RAWMAT_DENSITY",
        header: "Density gcm"
    },
    {
        accessorKey: "RAWMAT_MFIVAL",
        header: "MFI"
    },
    {
        accessorKey: "RAWMAT_BULKDENS",
        header: "Bulk Density"
    },
    {
        accessorKey: "RAWMAT_RAWTYP",
        header: "Type"
    },
    {
        accessorKey: "RAWMAT_ARTN",
        header: "Article"
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const { RAWMAT_RAWMAT } = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
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