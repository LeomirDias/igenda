"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useAction } from "next-safe-action/hooks";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifyAndCreateClient } from "@/actions/public-create-client";

const verificationSchema = z.object({
    code: z.string().length(6, { message: "O código deve ter 6 dígitos" }),
});

interface VerificationFormProps {
    clientData: {
        name: string;
        email: string;
        phoneNumber: string;
    };
}

const VerificationForm = ({ clientData }: VerificationFormProps) => {
    const router = useRouter();
    const params = useParams();
    const enterpriseSlug = params?.slug as string;

    const form = useForm<z.infer<typeof verificationSchema>>({
        resolver: zodResolver(verificationSchema),
        defaultValues: {
            code: "",
        },
    });

    const verifyAndCreateAction = useAction(verifyAndCreateClient, {
        onSuccess: ({ data }) => {
            if (data?.success) {
                toast.success("Conta criada com sucesso!");
                router.push(`/${enterpriseSlug}/client-home`);
            } else {
                toast.error(data?.message || "Código inválido");
            }
        },
        onError: (error) => {
            console.error("Erro ao verificar código:", error);
            toast.error("Erro ao verificar código");
        },
    });

    const onSubmit = (values: z.infer<typeof verificationSchema>) => {
        verifyAndCreateAction.execute({
            email: clientData.email,
            code: values.code,
            enterpriseSlug,
        });
    };

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <CardHeader>
                        <CardTitle>Verificação</CardTitle>
                        <CardDescription>
                            Digite o código de 6 dígitos enviado para o seu console.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Código de Verificação</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite o código..."
                                            maxLength={6}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={verifyAndCreateAction.isPending}>
                            {verifyAndCreateAction.isPending ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verificando...</>
                            ) : (
                                "Verificar"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default VerificationForm; 