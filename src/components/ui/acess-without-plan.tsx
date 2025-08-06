"use client";

import { Frown, SmilePlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "./button";
import { Card } from "./card";

export const AccessWhitoutPlan = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/subscription-plans");
    }, 8000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="bg-background flex min-h-screen w-full items-center justify-center">
      <Card className="w-full max-w-3xl space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h2 className="text-primary flex flex-col items-center justify-center gap-2 text-2xl font-bold tracking-tight">
            <Frown size={32} />
            Sem acesso...
          </h2>
          <p className="text-muted-foreground text-lg">
            Assine a iGenda para ter acesso ilimitado a essa tela e as
            funcionalidades dela!
          </p>
        </div>
        <div className="flex flex-col space-y-1 text-center">
          <span className="text-muted-foreground text-xs">
            Carregando ofertas de assinatura...
          </span>
          <div className="bg-muted relative flex h-2 items-center overflow-hidden rounded-full">
            <div
              className="bg-primary absolute inset-y-0 left-0"
              style={{
                width: "0%",
                animation: "progressBar 8s linear forwards",
              }}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/subscription">
            <Button variant="default">
              <SmilePlus />
              Assinar agora
            </Button>
          </Link>
        </div>
      </Card>

      <style>
        {`
          @keyframes progressBar {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}
      </style>
    </div>
  );
};
