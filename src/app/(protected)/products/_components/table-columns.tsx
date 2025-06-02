"use client"

import { productsTable } from "@/db/schema"
import { ColumnDef } from "@tanstack/react-table"
import TableProductActions from "./table-actions";



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
                <TableProductActions product={product} />
            )
        }
    }
]