"use client"
 
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {  ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu"


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { TableIntegrationsProps } from "./TableIntegrations.interface"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { formatPrice } from "@/lib/formatPrice"



const data: TableIntegrationsProps[] = [
    {
      app: "Stripe",
      icon: "/images/stripe.png",
      type: "Finance",
      rate: 60,
      profit: 450
    },
    {
      app: "Zapier",
      icon: "/images/zapier.png",
      type: "CMR",
      rate: 20,
      profit: 123.5
    },
    {
      app: "Shopify",
      icon: "/images/shopify.png",
      type: "Marketplace",
      rate: 80,
      profit: 879.8
    },
  ]

  export const columns: ColumnDef<TableIntegrationsProps>[] = [
    {
      accessorKey: "icon",
      header: "LOGO",
      cell: ({ row }) => (
        <div className="capitalize">
            <Image src={row.getValue("icon")} alt="Logo" width={20} height={20}/>
        </div>
      ),
    },
    {
      accessorKey: "app",
      header: "App",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("app")}</div>
      ),
    },
    {
      accessorKey: "type",
      header: ()=><div>Type</div>,
      cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
    },
    {
      accessorKey: "rate",
      header: () => <div>Rate</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium flex gap-1 items-center">
            <Progress value={row.getValue("rate")} className="h-2"/>
        </div>
      )
    },
    {
        accessorKey: "profit",
      header:({column})=>(
        <Button
            variant="ghost"
            className="float-end px-0"
            onClick={()=>column.toggleSorting(column.getIsSorted() === "asc")}
        >
            PROFIT
            <ChevronDown className="ml-2 h-4 2-4"/>
        </Button>
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("profit"))
        return (
            <div className="text-right font-medium">
                {formatPrice(amount)}
            </div>
        )
      },
    },
  ]

  export function TableIntegrations() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      []
    )
    const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
          sorting,
          columnFilters,
          columnVisibility,
          rowSelection,
        },
      })
  return (
    <div className="w-full mt-5">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
