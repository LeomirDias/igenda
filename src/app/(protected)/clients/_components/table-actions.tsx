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
import { Dialog } from "@/components/ui/dialog";
import UpsertClientForm from "./upsert-client-form";
import { clientsTable } from "@/db/schema";
import { useState } from "react";

interface ClientTableActionsProps {
    client: typeof clientsTable.$inferSelect;
}

const TableClientActions = ({ client }: ClientTableActionsProps) => {
    const [upsertDialgoIsOpen, setUpsertDialgoIsOpen] = useState(false);

    return (
        <Dialog open={upsertDialgoIsOpen} onOpenChange={setUpsertDialgoIsOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVerticalIcon className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Ações para {client.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setUpsertDialgoIsOpen(true)}>
                        <EditIcon className="w-4 h-4" />
                        Editar</DropdownMenuItem>
                    <DropdownMenuItem>
                        <Trash2 className="w-4 h-4" />
                        Excluir</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <UpsertClientForm
                client={client}
                onSuccess={() => setUpsertDialgoIsOpen(false)}
            />
        </Dialog>
    );
}

export default TableClientActions;