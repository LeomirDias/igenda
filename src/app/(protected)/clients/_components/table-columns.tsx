"use client"

import { ColumnDef } from "@tanstack/react-table"

import { clientsTable } from "@/db/schema"

import TableClientActions from "./table-actions";

type Client = typeof clientsTable.$inferSelect;

export const clientsTableColumns: ColumnDef<Client>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Nome",
    },
    {
        id: "email",
        accessorKey: "email",
        header: "E-mail",
    },
    {
        id: "phoneNumber",
        accessorKey: "phoneNumber",
        header: "Número de telefone",
        cell: ({ row }) => {
            const phone = row.getValue("phoneNumber") as string;
            if (!phone) return null;

            const formatted = phone.replace(
                /(\d{2})(\d{1})(\d{4})(\d{4})/,
                "($1) $2 $3-$4"
            );

            return formatted;
        }
    },
    {
        id: "actions",
        cell: (params) => {
            const client = params.row.original;
            return (
                <TableClientActions client={client} />
            )
        }
    }
]