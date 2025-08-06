"use client";

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
    title: string;
    price: string;
    paymentUrl: string;
    active?: boolean;
    savings?: string | null;
}

export default function SubscriptionPlanCard({
    title,
    price,
    paymentUrl,
    active = false,
    savings,
}: SubscriptionPlanProps) {
    const handleSubscribeClick = () => {
        window.open(paymentUrl, "_blank");
    };

    const handleCancelClick = () => {
        window.open(paymentUrl, "_blank");
    };

    return (
        <Card className="flex h-full w-full flex-col">
            <CardHeader className="pb-4">
                <div className="mb-2 flex items-center justify-between">
                    <CardTitle className="text-secondary-foreground text-lg font-bold sm:text-xl">
                        {title}
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
                        {price}
                    </span>
                    <span className="text-muted-foreground ml-1">/ mês</span>
                </div>
                {savings && (
                    <div className="mt-2">
                        <Badge variant="secondary" className="text-green-600 bg-green-100">
                            {savings}
                        </Badge>
                    </div>
                )}
            </CardHeader>

            <CardContent className="flex-1 pb-6">
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">
                        Clique em &quot;Assinar agora&quot; para escolher este plano
                    </p>
                </div>
            </CardContent>

            <CardFooter className="mt-auto">
                {active ? (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="default"
                                className="w-full"
                                size="lg"
                            >
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
                        variant="default"
                        className="w-full"
                        size="lg"
                    >
                        Assinar agora
                    </Button>
                )}

                {active && (
                    <Button
                        onClick={handleSubscribeClick}
                        variant="ghost"
                        className="mt-2 w-full"
                        size="sm"
                    >
                        Gerenciar dados da assinatura
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
} 