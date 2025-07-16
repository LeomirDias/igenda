"use client";

import { Mail, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();

  const handleResendEmail = () => {
    router.push("/authentication/resend-verification-email");
  };

  return (
    <Card className="w-full border-[#424242] bg-[#191919] backdrop-blur-sm sm:max-w-lg md:max-w-xl">
      <CardHeader className="space-y-4 text-center">
        <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
          <CheckCircle className="text-primary h-8 w-8" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Cadastro Realizado com Sucesso!
        </CardTitle>
        <CardDescription>Obrigado por se cadastrar na iGenda!</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            <strong>Verificação de Email Necessária</strong>
            <br />
            Enviamos um link de verificação para seu email. Clique no link para
            ativar sua conta e ter acesso completo ao sistema.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="text-muted-foreground space-y-2 text-sm">
            <p>
              <strong>Próximos passos:</strong>
            </p>
            <ol className="ml-2 list-inside list-decimal space-y-1">
              <li>Verifique sua caixa de entrada</li>
              <li>Procure por um email de verificação</li>
              <li>Clique no link de confirmação</li>
              <li>Faça login em sua conta</li>
            </ol>
          </div>

          <div className="bg-muted text-muted-foreground rounded-lg p-3 text-xs">
            <p>
              <strong>Não encontrou o email?</strong>
            </p>
            <p>
              Verifique sua pasta de spam ou lixo eletrônico. O email pode levar
              alguns minutos para chegar.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleResendEmail}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reenviar Email de Verificação
          </Button>

          <Button
            variant="default"
            className="w-full"
            onClick={() => (window.location.href = "/authentication")}
          >
            Ir para Login
          </Button>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground text-xs">
            Precisa de ajuda?{" "}
            <a
              href="https://wa.me/64992214800"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Entre em contato conosco
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
