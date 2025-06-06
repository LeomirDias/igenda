"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { initiateVerification } from "@/actions/public-create-client";
import VerificationForm from "./verification-form";

const clientRegisterSchema = z.object({
    name: z.string().trim().min(1, { message: "O nome é obrigatório" }),
    email: z.string().trim().min(1, { message: "E-mail é obrigatório." }).email({ message: "Email inválido" }),
    phoneNumber: z.string().trim().min(1, { message: "Telefone é obrigatório" }),
});

type ClientFormData = z.infer<typeof clientRegisterSchema>;

const ClientSignUpForm = () => {
    const [showVerification, setShowVerification] = useState(false);
    const [clientData, setClientData] = useState<ClientFormData | null>(null);

    const form = useForm<ClientFormData>({
        resolver: zodResolver(clientRegisterSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
        },
    });

    const initiateVerificationAction = useAction(initiateVerification, {
        onSuccess: ({ data }) => {
            if (data?.success) {
                setShowVerification(true);
                toast.success("Código de verificação enviado! Verifique o console.");
            } else {
                toast.error(data?.message || "Erro ao enviar código de verificação");
            }
        },
        onError: (error) => {
            console.error("Erro ao enviar código:", error);
            toast.error("Erro ao enviar código de verificação");
        },
    });

    const onSubmit = (values: ClientFormData) => {
        setClientData(values);
        initiateVerificationAction.execute(values);
    };

    if (showVerification && clientData) {
        return <VerificationForm clientData={clientData} />;
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <CardHeader>
                        <CardTitle>Cadastro</CardTitle>
                        <CardDescription>
                            Crie uma conta para continuar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite seu nome..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite seu e-mail..." {...field} />
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
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Digite seu telefone..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={initiateVerificationAction.isPending}>
                            {initiateVerificationAction.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando código...</>
                            ) : (
                                "Criar conta"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default ClientSignUpForm;