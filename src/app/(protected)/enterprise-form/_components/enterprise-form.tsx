"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createEnterprise } from "@/actions/create-enterprise";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const enterpriseFormSchema = z.object({
    name: z.string().trim().min(1, { message: "Nome da empresa é obrigatório." }),
    specialty: z.string().trim().min(1, { message: "Especialidade da empresa é obrigatória." }),
    phoneNumber: z.string().trim().min(1, { message: "Telefone da empresa é obrigatório." }),
    register: z.string().trim().min(1, { message: "CPF do responsável ou CNPJ da empresa é obrigatório." }),
    instagramURL: z.string().trim().url({ message: "URL do Instagram inválida." }),
});

const EnterpriseForm = () => {

    const form = useForm<z.infer<typeof enterpriseFormSchema>>({
        resolver: zodResolver(enterpriseFormSchema),
        defaultValues: {
            name: "",
            specialty: "",
            phoneNumber: "",
            register: "",
            instagramURL: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof enterpriseFormSchema>) => {
        try {
            await createEnterprise(data.name, data.specialty, data.phoneNumber, data.register, data.instagramURL);
            toast.success("Empresa cadastrada com sucesso!");
            form.reset();
        } catch (error) {
            if (isRedirectError(error)) {
                return
            }
            console.error("Erro ao cadastrar empresa:", error);
            toast.error("Erro ao cadastrar empresa. Por favor, tente novamente.");
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o nome da sua empresa" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="specialty"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Área de atuação</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o ramo de atuação da sua empresa" {...field} />
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
                    <FormField
                        control={form.control}
                        name="register"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Registro (CPF ou CNPJ)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o CNPJ ou CPF do responsável pela empresa" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="instagramURL"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instagram</FormLabel>
                                <FormControl>
                                    <Input placeholder="Cole aqui o link do Instagram da sua empresa..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Cadastrar empresa")}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </>

    );
}

export default EnterpriseForm;