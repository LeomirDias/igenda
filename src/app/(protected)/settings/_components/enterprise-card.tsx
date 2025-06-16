"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Store } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { updateEnterprise } from "@/actions/update-enterprise";
import { enterpriseSpecialty } from "@/app/(protected)/enterprise-form/_constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { enterprisesTable } from "@/db/schema";

const formSchema = z.object({
    name: z.string().trim().min(1, { message: "Nome da empresa é obrigatório." }),
    specialty: z.string().trim().min(1, { message: "Área de atuação é obrigatória." }),
    phoneNumber: z.string().trim().min(1, { message: "Telefone da empresa é obrigatório." }),
    register: z.string().trim().min(1, { message: "Registro da empresa é obrigatório." }),
    instagramURL: z.string().trim().url({ message: "URL do Instagram inválida." }),
    cep: z.string().trim().min(1, { message: "CEP da empresa é obrigatório." }),
    address: z.string().trim().min(1, { message: "Endereço da empresa é obrigatório." }),
    number: z.string().trim().min(1, { message: "Número da empresa é obrigatório." }),
    complement: z.string().trim().optional(),
    city: z.string().trim().min(1, { message: "Cidade da empresa é obrigatória." }),
    state: z.string().trim().min(1, { message: "Estado da empresa é obrigatório." }),
})

interface EnterpriseCardProps {
    enterprise?: typeof enterprisesTable.$inferSelect;
}

const EnterpriseCard = ({ enterprise }: EnterpriseCardProps) => {
    const [isCepLoading, setIsCepLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        shouldUnregister: true,
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: enterprise?.name || "",
            specialty: enterprise?.specialty || "",
            phoneNumber: enterprise?.phoneNumber || "",
            register: enterprise?.register || "",
            instagramURL: enterprise?.instagramURL || "",
            cep: enterprise?.cep || "",
            address: enterprise?.address || "",
            number: enterprise?.number || "",
            complement: enterprise?.complement || "",
            city: enterprise?.city || "",
            state: enterprise?.state || "",
        },
    });

    const upsertEnterpriseAction = useAction(updateEnterprise, {
        onSuccess: () => {
            toast.success(enterprise ? "Empresa atualizada com sucesso!" : "Empresa adicionada com sucesso!");
            form.reset();
            window.location.reload();
        },
        onError: (error) => {
            console.error("Erro ao salvar empresa:", error);
            toast.error(enterprise ? `Erro ao atualizar empresa.` : `Erro ao adicionar empresa.`);
        },
    });

    const cep = form.watch("cep");

    useEffect(() => {
        const fetchAddressFromCep = async (cep: string) => {
            const formattedCep = cep.replace(/\D/g, "");
            if (formattedCep.length === 8) {
                setIsCepLoading(true);
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
                    if (!response.ok) {
                        throw new Error("CEP não encontrado");
                    }
                    const data = await response.json();
                    if (data.erro) {
                        toast.error("CEP não encontrado. Verifique o CEP digitado.");
                        form.setValue("address", "", { shouldValidate: true });
                        form.setValue("city", "", { shouldValidate: true });
                        form.setValue("state", "", { shouldValidate: true });
                        form.setValue("complement", "", { shouldValidate: true });
                    } else {
                        form.setValue("address", data.logradouro, { shouldValidate: true });
                        form.setValue("city", data.localidade, { shouldValidate: true });
                        form.setValue("state", data.uf, { shouldValidate: true });
                        toast.success("Endereço preenchido automaticamente!");
                    }
                } catch (error) {
                    console.error("Erro ao buscar CEP:", error);
                    toast.error("Erro ao buscar CEP. Tente novamente.");
                    form.setValue("address", "", { shouldValidate: true });
                    form.setValue("city", "", { shouldValidate: true });
                    form.setValue("state", "", { shouldValidate: true });
                } finally {
                    setIsCepLoading(false);
                }
            }
        };

        if (cep) {
            fetchAddressFromCep(cep);
        }
    }, [cep, form]);

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        upsertEnterpriseAction.execute({
            ...values,
            id: enterprise?.id,
        })
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    <CardTitle>Dados da Empresa</CardTitle>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da Empresa</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione sua área de atuação..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {enterpriseSpecialty.map((specialty) => (
                                                    <SelectItem key={specialty.value} value={specialty.value}>
                                                        {specialty.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                        <FormLabel>Registro</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cep"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input {...field} />
                                                {isCepLoading && (
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Endereço</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isCepLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="complement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complemento</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isCepLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isCepLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={upsertEnterpriseAction.isPending}>
                                {upsertEnterpriseAction.isPending
                                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                                    : enterprise ? "Editar empresa"
                                        : "Cadastrar empresa"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default EnterpriseCard;