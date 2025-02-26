"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { t_rawtyp } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"


export const columns: ColumnDef<t_rawtyp>[] = [
    {
        accessorKey: "RAWTYP_RAWTYP",
        header: ({ column }) => {
            return (
                <Button variant="ghost" className="m-0 p-0 flex items-center" onClick={ () => column.toggleSorting(column.getIsSorted()==="desc")}>
                    Key
                    <ArrowUpDown className="w-4 h-4"/>
                </Button>
            )
        }
    },
    {
        accessorKey: "RAWTYP_SHORT",
        header: "Name"
    },
    {
        accessorKey: "RAWTYP_DESC",
        header: "Description"
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const { RAWTYP_RAWTYP } = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-4 p-0">
                            <MoreHorizontal className="w-4 h-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/materials/type/${RAWTYP_RAWTYP}`}>
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