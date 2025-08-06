"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { verifyTokenAndSetPassword } from "@/actions/verify-token-and-set-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
  confirmPassword: z.string().min(8, "Confirmação deve ter pelo menos 8 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export function SetPassworForm({ }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const verifyTokenAction = useAction(verifyTokenAndSetPassword, {
    onSuccess: (data) => {
      if (data?.data?.error) {
        toast.error(data.data.error);
      } else {
        toast.success("Senha definida com sucesso! Faça login para continuar.");
        // Redirecionar para login
        router.push("/authentication");
      }
    },
    onError: () => {
      toast.error("Erro ao definir senha. Tente novamente.");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error("Token não encontrado");
      return;
    }

    verifyTokenAction.execute({
      token,
      password: values.password,
    });
  }

  return (
    <Card className="w-full max-w-md border-trasnparent bg-gradient-to-br from-[#347d61] to-[#88b94d] backdrop-blur-sm sm:max-w-lg md:max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl">
              Definir senha
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-white">
              Insira sua senha e confirme.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">
                    Nova senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha"
                      type="password"
                      {...field}
                      className="h-10 text-sm sm:h-11 sm:text-base placeholder:text-white/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">
                    Confirmar nova senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirme sua senha"
                      type="password"
                      {...field}
                      className="h-10 text-sm sm:h-11 sm:text-base placeholder:text-white/70"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <div className="w-full space-y-2">
              <Button
                type="submit"
                className="h-10 w-full text-sm sm:h-11 sm:text-base"
                disabled={verifyTokenAction.isPending}
              >
                {verifyTokenAction.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Definir senha"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default SetPassworForm;
