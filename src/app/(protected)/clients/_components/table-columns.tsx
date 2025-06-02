"use client"

import { clientsTable } from "@/db/schema"
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVerticalIcon className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Ações para {client.name}</DropdownMenuLabel>
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