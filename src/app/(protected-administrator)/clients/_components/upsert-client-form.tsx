import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { upsertClient } from "@/actions/upsert-client";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { clientsTable } from "@/db/schema";


const formSchema = z.object({
    name: z.string().trim().min(1, { message: "Nome do serviço é obrigatório." }),
    phoneNumber: z.string().min(1, { message: "Número de telefone é obrigatório." }),
})

interface upsertClientFormProps {
    client?: typeof clientsTable.$inferSelect;
    onSuccess?: () => void;
}

const UpsertClientForm = ({ client, onSuccess }: upsertClientFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        shouldUnregister: true,
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: client?.name || "",
            phoneNumber: client?.phoneNumber || "",
        }
    })

    const upsertClientAction = useAction(upsertClient, {
        onSuccess: () => {
            toast.success("Cliente adicionado com sucesso!");
            onSuccess?.();
            form.reset();
        },
        onError: () => {
            toast.error(`Erro ao adicionar cliente.`);
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        upsertClientAction.execute({
            ...values,
            id: client?.id,
            phoneNumber: values.phoneNumber,
        });
    };

    return (
        <DialogContent>
            <DialogTitle>{client ? client.name : "Adicionar cliente"}</DialogTitle>
            <DialogDescription>{client ? "Edite as informações desse cliente." : "Adicione um novo cliente à sua empresa!"}</DialogDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Nome do cliente
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o nome do cliente" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contato</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite a número de contato da sua empresa" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit" disabled={upsertClientAction.isPending}>
                            {upsertClientAction.isPending
                                ? "Salvando..."
                                : client ? "Editar cliente"
                                    : "Cadastrar cliente"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}

export default UpsertClientForm;