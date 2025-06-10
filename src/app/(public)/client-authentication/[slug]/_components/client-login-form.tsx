"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { generateCode } from "@/actions/client-verifications/generate-code";
import { validatePhone } from "@/actions/client-verifications/validate-phone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import VerificationForm from "./verification-form";

const clientLoginSchema = z.object({
    phoneNumber: z.string().trim().min(1, { message: "Telefone é obrigatório" }),
});

const ClientLoginForm = () => {
    const router = useRouter();
    const params = useParams();
    const enterpriseSlug = params?.slug as string;
    const [showVerification, setShowVerification] = useState(false);
    const [clientData, setClientData] = useState<{ name: string; phoneNumber: string; } | null>(null);

    const form = useForm<z.infer<typeof clientLoginSchema>>({
        resolver: zodResolver(clientLoginSchema),
        defaultValues: {
            phoneNumber: "",
        },
    });

    const validatePhoneAction = useAction(validatePhone, {
        onSuccess: async ({ data }) => {
            if (data?.success && data.client) {
                try {
                    // Gera o código de verificação
                    const result = await generateCode({
                        phoneNumber: data.client.phoneNumber,
                        clientData: {
                            name: data.client.name,
                            phoneNumber: data.client.phoneNumber,
                        },
                    });

                    if (result?.data?.success) {
                        setClientData({
                            name: data.client.name,
                            phoneNumber: data.client.phoneNumber,
                        });
                        setShowVerification(true);
                        toast.success("Código de verificação enviado para seu Whatsapp!");
                    } else {
                        toast.error("Erro ao gerar código de verificação. Por favor, tente novamente.");
                    }
                } catch (error) {
                    console.error("Erro ao gerar código:", error);
                    toast.error("Erro ao gerar código de verificação. Por favor, tente novamente.");
                }
            } else {
                toast.error(data?.message || "Erro ao validar telefone. Por favor, tente novamente.");
            }
        },
        onError: (error) => {
            console.error("Erro ao validar telefone:", error);
            toast.error("Erro ao validar telefone. Por favor informe o telefone cadastrado.");
        },
    });

    const onSubmit = (values: z.infer<typeof clientLoginSchema>) => {
        validatePhoneAction.execute({
            phoneNumber: values.phoneNumber.replace(/\D/g, ""),
            enterpriseSlug,
        });
    };

    if (showVerification && clientData) {
        return <VerificationForm clientData={clientData} />;
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Faça login na sua conta para continuar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                        <PatternFormat
                                            format="(##) #####-####"
                                            mask="_"
                                            customInput={Input}
                                            placeholder="Digite seu telefone cadastrado..."
                                            value={field.value}
                                            onValueChange={(values) => {
                                                field.onChange(values.value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={validatePhoneAction.isPending}>
                            {validatePhoneAction.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validando...</>
                            ) : (
                                "Entrar"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default ClientLoginForm; 