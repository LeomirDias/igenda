"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { updateUserData } from "@/actions/update-user-data";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const validSubscriptionFormSchema = z.object({
    docNumber: z.string().trim().min(1, { message: "CPF é obrigatório." }),
    phone: z.string().trim().min(1, { message: "Telefone é obrigatório." }),
});

const ValidSubscriptionForm = () => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const [subscriptionState, setSubscriptionState] = useState<"default" | "withoutSubscription">("default");

    const { execute, status } = useAction(updateUserData, {
        onSuccess: () => {
            toast.success("Assinatura validada com sucesso!");
            router.push("/dashboard");
        },
        onError: () => {
            setSubscriptionState("withoutSubscription");
            toast.error("Nenhuma assinatura encontrada para este CPF.");
        },
    });

    const form = useForm<z.infer<typeof validSubscriptionFormSchema>>({
        resolver: zodResolver(validSubscriptionFormSchema),
        defaultValues: {
            docNumber: "",
            phone: "",
        },
    });

    // Usar um valor padrão para evitar problemas de hidratação
    const isMobileSafe = isMobile ?? false;

    const onSubmit = async (data: z.infer<typeof validSubscriptionFormSchema>) => {
        try {
            // Limpar o telefone removendo caracteres especiais e adicionar código do país
            const cleanPhone = `55${data.phone.replace(/\D/g, "")}`;

            await execute({
                docNumber: data.docNumber,
                phone: cleanPhone,
            });
        } catch (error) {
            if (isRedirectError(error)) {
                return;
            }
            console.error("Erro ao validar assinatura:", error);
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={`${isMobileSafe ? "space-y-3" : "space-y-4"} pb-2`}
                >
                    <FormField
                        control={form.control}
                        name="docNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    CPF <span className="text-red-300">(Deve ser o mesmo CPF utilizado na assinatura)</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Digite seu CPF"
                                        className="text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Telefone <span className="text-red-300">(Deve ser o mesmo telefone utilizado na assinatura)</span>
                                </FormLabel>
                                <FormControl>
                                    <PatternFormat
                                        format="(##) #####-####"
                                        mask="_"
                                        placeholder="Digite seu telefone"
                                        customInput={Input}
                                        className="text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <DialogFooter className="flex-col gap-3 pt-4 sm:flex-row sm:gap-2 sm:pt-0">
                        <Button
                            type="submit"
                            disabled={form.formState.isSubmitting || status === "executing"}
                            className="w-full sm:w-auto"
                            variant="default"
                        >
                            {form.formState.isSubmitting || status === "executing" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Validar assinatura"
                            )}
                        </Button>
                        {subscriptionState === "withoutSubscription" && (
                            <Button
                                type="button"
                                onClick={() => router.push("/subscription-plans")}
                                className="w-full sm:w-auto"
                                variant="outline"
                            >
                                Ver planos de assinatura
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
};

export default ValidSubscriptionForm;
