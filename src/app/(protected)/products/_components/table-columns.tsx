"use client"

import { clientsTable, productsTable } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { EditIcon, MoreVerticalIcon, Trash2 } from "lucide-react";

type Product = typeof productsTable.$inferSelect;

export const productsTableColumns: ColumnDef<Product>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Nome",
    },
    {
        id: "brand",
        accessorKey: "brand",
        header: "Marca",
    },
    {
        id: "category",
        accessorKey: "category",
        header: "Categoria",
    },
    {
        id: "price",
        accessorKey: "productPriceInCents",
        header: "Preço",
        cell: ({ row }) => {
            const price = row.original.productPriceInCents / 100;
            return `R$ ${price.toFixed(2)}`;
        }
    },
    {
        id: "quantity",
        accessorKey: "quantity",
        header: "Quantidade",
    },
    {
        id: "quantity_in_stock",
        accessorKey: "quantity_in_stock",
        header: "Quantidade em estoque",
    },
    {
        id: "stock_status",
        accessorKey: "stock_status",
        header: "Status do estoque",
    },
    {
        id: "actions",
        cell: (params) => {
            const product = params.row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Ações para {product.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <EditIcon className="w-4 h-4" />
                            Editar</DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash2 className="w-4 h-4" />
                            Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]