"use client"

import { loadStripe } from "@stripe/stripe-js"
import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"

import { createStripeCheckout } from "@/actions/create-stripe-checkout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SubscriptionPlanProps {
    active?: boolean
    className?: string
    userEmail?: string
}

export default function SubscriptionPlan({ active = false, userEmail }: SubscriptionPlanProps) {

    const router = useRouter();

    const createStripeCheckoutAction = useAction(createStripeCheckout, {
        onSuccess: async ({ data }) => {
            if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
                throw new Error("Stripe publishable key not found")
            }
            const stripe = await loadStripe(
                process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
            );

            if (!stripe) {
                throw new Error("Stripe not found")
            }
            if (!data?.sessionId) {
                throw new Error("Session ID not found")
            }
            await stripe.redirectToCheckout({
                sessionId: data?.sessionId
            })
        },
    })

    const features = [
        "Cadastro de até 3 profissionais",
        "Agendamentos ilimitados",
        "Métricas básicas",
        "Cadastro de clientes",
        "Confirmação manual",
        "Suporte via e-mail",
    ]

    const handleSubscribeClick = () => {
        createStripeCheckoutAction.execute();
    }

    const handleManagePlanClick = () => {
        router.push(`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${userEmail}`);
    }

    return (
        <Card className="w-[350px]">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl font-bold text-gray-900">Essential</CardTitle>
                    {active && (
                        <Badge className="text-primary bg-primary/10">
                            Atual
                        </Badge>
                    )}
                </div>
                <CardDescription className="text-sm text-gray-600 mb-4">
                    Para profissionais autônomos ou pequenas empresas
                </CardDescription>
                <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">R$59,90</span>
                    <span className="text-gray-600 ml-1">/ mês</span>
                </div>
            </CardHeader>

            <CardContent className="pb-6">
                <ul className="space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-5 h-5 bg-teal-100 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter>
                <Button
                    onClick={active ? handleManagePlanClick : handleSubscribeClick}
                    disabled={createStripeCheckoutAction.isExecuting}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">

                    {createStripeCheckoutAction.isExecuting ?
                        (<Loader2 className="w-4 h-4 animate-spin mr-1" />) :
                        (active ? "Gerenciar assinatura" : "Fazer assinatura")}
                </Button>
            </CardFooter>
        </Card>
    )
}
