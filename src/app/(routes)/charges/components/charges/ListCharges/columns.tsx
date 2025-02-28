"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { t_rawmat } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"


export const columns: ColumnDef<t_rawmat>[] = [
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
          const date = new Date(rawValue);
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