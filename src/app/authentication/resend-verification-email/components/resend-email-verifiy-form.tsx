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

export function ResendEmailVerificationForm({
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

    const { error } = await authClient.sendVerificationEmail({
      email: values.email,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("E-mail de verificação reenviado com sucesso!");
    }

    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md border-[#424242] bg-[#191919] backdrop-blur-sm sm:max-w-lg md:max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl">
              Reenviar Email de Verificação
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Digite seu e-mail para receber um novo link de verificação.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu e-mail..."
                      {...field}
                      className="h-10 text-sm sm:h-11 sm:text-base"
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Reenviar Email"
                )}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default ResendEmailVerificationForm;
