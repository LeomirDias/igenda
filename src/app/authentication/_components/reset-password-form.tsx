"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

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
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const formSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") as string;

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    if (values.password !== values.confirmPassword) {
      toast.error("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Senha redefinida com sucesso");
      router.push("/authentication");
    }

    setIsLoading(false);
  }

  return (
    <Card className="border-green-800/50 bg-green-950/30 backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-green-50">Redefinir senha</CardTitle>
            <CardDescription className="text-green-200/80">
              Digite sua nova senha e confirme.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-100">Senha</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite sua senha"
                      type="password"
                      className="border-green-700/50 bg-green-900/20 text-green-50 placeholder:text-green-300/50 focus:border-green-500 focus:ring-green-500/20"
                      {...field}
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
                  <FormLabel className="text-green-100">
                    Confirmar senha
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirme sua senha"
                      type="password"
                      className="border-green-700/50 bg-green-900/20 text-green-50 placeholder:text-green-300/50 focus:border-green-500 focus:ring-green-500/20"
                      {...field}
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
                className="w-full border-green-600 bg-green-600 text-white hover:border-green-700 hover:bg-green-700"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Redefinir senha"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default ResetPasswordForm;
