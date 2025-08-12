"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface MonthlyPlanCardProps {
    active?: boolean;
}

export default function MonthlyPlanCard({
    active = false,
}: MonthlyPlanCardProps) {


    return (
        <Card className="flex h-full w-full flex-col border-2 border-rose-500 bg-background shadow-lg hover:shadow-xl transition-all duration-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg animate-pulse"
                >
                    🔥 Promoção 50% OFF
                </span>
            </div>
            <CardHeader className="pb-4  text-white rounded-t-lg">
                <div className="mb-2 flex items-center justify-between">
                    <CardTitle className="text-white text-lg font-bold sm:text-xl">
                        Assinatura Mensal
                    </CardTitle>
                    {active && (
                        <Badge className="text-rose-500 text-xs bg-white">Assinatura atual</Badge>
                    )}
                </div>
                <CardDescription className="text-white mb-4 text-sm">
                    Mensal com 50% de desconto! <br />
                    <span className="text-rose-500 text-sm font-semibold">
                        Promoção válida apenas para o primeiro mês de assinatura.
                    </span>
                </CardDescription>
                <div className="flex items-baseline">
                    <span className="text-white text-2xl font-bold sm:text-3xl">
                        R$ 19,90
                    </span>
                    <span className="text-white ml-1">/ mês</span>
                </div>

            </CardHeader>

            <CardFooter className="mt-auto">
                <Button
                    onClick={() => { window.open("https://pay.cakto.com.br/ht897wv_511991", "_blank") }}
                    variant="default"
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                    size="lg"
                >
                    Assinar agora com 50% de desconto!
                </Button>
            </CardFooter>
        </Card>
    );
}
