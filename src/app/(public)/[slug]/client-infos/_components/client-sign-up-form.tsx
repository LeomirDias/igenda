"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { generateCode } from "@/actions/client-verifications";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import VerificationForm from "./verification-form";

const clientRegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, {
      message: "O nome é obrigatório e deve ter no mínimo 3 caracteres",
    }),
  phoneNumber: z
    .string()
    .trim()
    .length(11, { message: "Telefone deve ter 11 dígitos (DDD + número, ex: 11999999999)" }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os termos de uso e privacidade",
  }),
});

type ClientFormData = z.infer<typeof clientRegisterSchema>;

// Tipo para os dados que serão enviados para a action
type ClientDataForAction = {
  name: string;
  phoneNumber: string;
  enterpriseSlug: string;
};

const ClientSignUpForm = () => {
  const params = useParams();
  const enterpriseSlug = params?.slug as string;
  const [showVerification, setShowVerification] = useState(false);
  const [clientData, setClientData] = useState<ClientDataForAction | null>(null);

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientRegisterSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      acceptTerms: false,
    },
  });

  const generateCodeAction = useAction(generateCode, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setShowVerification(true);
        toast.success("Código de verificação enviado! Verifique seu Whatsapp.");
      } else {
        toast.error(
          data?.message ||
          "Erro ao enviar código de verificação. Por favor, tente novamente.",
        );
      }
    },
    onError: (error) => {
      console.error("Erro ao enviar código:", error);
      toast.error(
        "Erro ao enviar código de verificação. Por favor, tente novamente.",
      );
    },
  });

  const onSubmit = (values: ClientFormData) => {
    const formattedValues: ClientDataForAction = {
      name: values.name,
      phoneNumber: `55${values.phoneNumber.replace(/\D/g, "")}`,
      enterpriseSlug,
    };

    setClientData(formattedValues);
    generateCodeAction.execute({
      phoneNumber: formattedValues.phoneNumber,
      clientData: formattedValues,
    });
  };

  if (showVerification && clientData) {
    return <VerificationForm clientData={clientData} isLogin={false} />;
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground select-none">+55</span>
                      <Input
                        type="tel"
                        placeholder="11999999999"
                        value={field.value}
                        onChange={(e) => {
                          // Aceita apenas números
                          field.onChange(e.target.value.replace(/\D/g, ""));
                        }}
                        maxLength={11}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        Aceito os termos de uso e a política de privacidade
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={generateCodeAction.isPending || !form.watch("acceptTerms")}
            >
              {generateCodeAction.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando
                  código...
                </>
              ) : (
                "Cadastrar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ClientSignUpForm;
