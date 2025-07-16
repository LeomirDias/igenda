"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
  email: z.string().email(),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/authentication/reset-password",
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("E-mail de redefinição de senha enviado");
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
              Digite seu e-mail para receber um link de redefinição de senha.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-100">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu e-mail..."
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
                  "Receber link"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default ForgotPasswordForm;
