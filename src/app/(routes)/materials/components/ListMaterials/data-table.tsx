"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    ColumnDef,
    SortingState,
    ColumnFiltersState,
    getFilteredRowModel,
    useReactTable,
    getPaginationRowModel,
    getCoreRowModel,
    getSortedRowModel,
    flexRender
} from "@tanstack/react-table"

import React from "react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[],
    data: TData[]
}

export function DataTable<TData, TValue> ({
    columns,
    data
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [isMounted, setIsMounted] = React.useState(false)

    React.useEffect(()=>{
        setIsMounted(true)
    }, [])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        }        
    })
    
    if (!isMounted) {
        return null
    }

    return (
        <div className="p-4 bg-background shadow-md rounded-lg mt-4">
            <div className="flex items-center mb-2">
                <Input 
                    placeholder="Filter the Material..."
                    value={(table.getColumn("RAWMAT_NAME")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("RAWMAT_NAME")?.setFilterValue(event.target.value)}
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {
                            table.getHeaderGroups().map((headerGroup)=>(
                                <TableRow key={headerGroup.id}>
                                    {
                                        headerGroup.headers.map((header)=>{
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            )
                                        })
                                    }            
                                </TableRow>
                            ))
                        }
                    </TableHeader>
                    <TableBody>
                        {
                            table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row)=>(
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {
                                            row.getVisibleCells().map((cell)=>(
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell key={columnFilters.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <div className="flext items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={()=>table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={()=>table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div>
        </div>
    )
} 