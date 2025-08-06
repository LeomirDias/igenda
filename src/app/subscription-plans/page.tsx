
import Image from "next/image";

import SubscriptionPlanCard from "./_components/subscription-plan-card";

const SubscriptionPage = async () => {
  const plans = [
    {
      title: "Assinatura Mensal",
      price: "R$39,90",
      paymentUrl: "https://pay.cakto.com.br/ht897wv_511991",
      savings: null,
    },
    {
      title: "Assinatura Trimestral",
      price: "R$104,90",
      paymentUrl: "https://pay.cakto.com.br/5aqjg9q_513522",
      savings: "Em até 3x de R$ 34,96",
    },
    {
      title: "Assinatura Semestral",
      price: "R$179",
      paymentUrl: "https://pay.cakto.com.br/3cia8pm_513526",
      savings: "Em até 6x de R$ 29,83",
    },
  ];

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

  return (
    <div className="min-h-screen p-4">
      {/* Logo no canto superior esquerdo */}
      <div className="mb-6">
        <Image
          src="/LogoiGenda.png"
          alt="iGenda Logo"
          width={80}
          height={80}
          className="h-auto w-auto"
          priority
        />
      </div>

      <div className="flex flex-col items-center">
        {/* Features destacadas */}
        <div className="mb-6 w-full max-w-4xl">
          <h2 className="text-secondary-foreground mb-4 text-center text-xl font-bold">
            Todos os planos incluem:
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 rounded-lg bg-muted/50 p-2">
                <div className="bg-primary/10 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full">
                  <svg
                    className="text-primary h-2.5 w-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-secondary-foreground text-xs font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div key={index} className="flex h-full">
              <SubscriptionPlanCard
                title={plan.title}
                price={plan.price}
                paymentUrl={plan.paymentUrl}
                savings={plan.savings}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
