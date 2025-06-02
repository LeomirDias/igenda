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
import UpsertProductForm from "./upsert-product-form";
import { productsTable } from "@/db/schema";
import { useState } from "react";

interface ProductsTableActionsProps {
    product: typeof productsTable.$inferSelect;
}

const TableProductActions = ({ product }: ProductsTableActionsProps) => {

    const [upsertDialgoIsOpen, setUpsertDialgoOpen] = useState(false);

    return (
        <Dialog open={upsertDialgoIsOpen} onOpenChange={setUpsertDialgoOpen}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVerticalIcon className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Ações para {product.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setUpsertDialgoOpen(true)}>
                        <EditIcon className="w-4 h-4" />
                        Editar</DropdownMenuItem>
                    <DropdownMenuItem>
                        <Trash2 className="w-4 h-4" />
                        Excluir</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <UpsertProductForm
                product={product}
                onSuccess={() => setUpsertDialgoOpen(false)}
            />
        </Dialog>
    );
}

export default TableProductActions;