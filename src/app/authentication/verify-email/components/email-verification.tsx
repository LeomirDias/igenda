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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Cadastro Realizado com Sucesso!
          </CardTitle>
          <CardDescription className="text-gray-600">
            Obrigado por se cadastrar na iGenda!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-green-200 bg-green-50">
            <Mail className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Verificação de Email Necessária</strong>
              <br />
              Enviamos um link de verificação para seu email. Clique no link
              para ativar sua conta e ter acesso completo ao sistema.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2 text-sm text-gray-600">
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

            <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
              <p>
                <strong>Não encontrou o email?</strong>
              </p>
              <p>
                Verifique sua pasta de spam ou lixo eletrônico. O email pode
                levar alguns minutos para chegar.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full bg-transparent"
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
            <p className="text-xs text-gray-500">
              Precisa de ajuda?{" "}
              <a
                href="https://wa.me/64992214800"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                Entre em contato conosco
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
