"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { cancelSubscription } from "@/actions/cancel-stripe-subscription";
import { createStripeCheckout } from "@/actions/create-stripe-checkout";
import { createStripePortal } from "@/actions/create-stripe-portal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SubscriptionPlanProps {
  active?: boolean;
  className?: string;
  userEmail?: string;
}

export default function SubscriptionPlan({
  active = false,

}: SubscriptionPlanProps) {
  const router = useRouter();

  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: async ({ data }) => {
      const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!stripeKey) throw new Error("Stripe publishable key not found");

      const stripe = await loadStripe(stripeKey);
      if (!stripe) throw new Error("Stripe not found");
      if (!data?.sessionId) throw new Error("Session ID not found");

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    },
  });

  const cancelSubscriptionAction = useAction(cancelSubscription, {
    onSuccess: () => {
      router.refresh();
    },
  });

  const createStripePortalAction = useAction(createStripePortal, {
    onSuccess: ({ data }) => {
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    },
  });

  const features = [
    "Cadastro de profissionais ilimitados",
    "Cadastro de clientes ilimitados",
    "Agendamentos ilimitados",
    "Agendamento via link para clientes",
    "Link de agendamento personalizado",
    "Gestão de estoque de produtos e equipamentos",
    "Métricas de agendamento, faturamento e mais",
    "Integração com WhatsApp",
    "Mensagens automáticas para clientes",
    "Cadastro de mensagens promocionais",
    "Suporte via 24/7 via WhatsApp",
    "Acesso integral a todas as novidades e atualizações",
  ];

  const handleSubscribeClick = () => {
    createStripeCheckoutAction.execute();
  };

  const handleCancelClick = () => {
    cancelSubscriptionAction.execute();
  };

  const handleManagePortalClick = () => {
    createStripePortalAction.execute();
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="mb-2 flex items-center justify-between">
          <CardTitle className="text-secondary-foreground text-xl font-bold sm:text-2xl">
            Assinatura iGenda | Acesso total
          </CardTitle>
          {active && (
            <Badge className="text-primary bg-primary/10">Assinatura ativa</Badge>
          )}
        </div>
        <CardDescription className="text-muted-foreground mb-4 text-sm">
          Para profissionais autônomos, pequenas, médias e grandes empresas.
        </CardDescription>
        <div className="flex items-baseline">
          <span className="text-secondary-foreground text-2xl font-bold sm:text-3xl">
            R$39,90
          </span>
          <span className="text-muted-foreground ml-1">/ mês</span>
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full">
                <Check className="text-primary h-3 w-3" />
              </div>
              <span className="text-secondary-foreground text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 text-center sm:flex-row sm:justify-between">
        {active ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={cancelSubscriptionAction.isExecuting}
                variant="default"
                className="w-full sm:w-auto"
              >
                {cancelSubscriptionAction.isExecuting && (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                )}
                Cancelar assinatura
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base md:text-lg lg:text-xl">
                  Tem certeza que deseja cancelar sua assinatura?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm md:text-base lg:text-lg">
                  Essa ação irá cancelar sua assinatura atual. Você perderá acesso a todos os recursos premium após o período atual.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="text-sm md:text-base">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelClick}
                  className="text-sm md:text-base"
                >
                  Confirmar cancelamento
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            onClick={handleSubscribeClick}
            disabled={createStripeCheckoutAction.isExecuting}
            variant="default"
            className="w-full sm:w-auto"
          >
            {createStripeCheckoutAction.isExecuting && (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            )}
            Assinar agora
          </Button>
        )}

        {active && (
          <Button
            onClick={handleManagePortalClick}
            disabled={createStripePortalAction.isExecuting}
            variant="ghost"
            className="w-full sm:w-auto"
          >
            {createStripePortalAction.isExecuting && (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            )}
            Gerenciar dados da assinatura
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
