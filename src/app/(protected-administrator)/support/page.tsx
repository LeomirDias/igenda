import type { Metadata } from "next";

import EmailCard from "@/app/(protected-administrator)/support/_components/email-card";
import SupportHeader from "@/app/(protected-administrator)/support/_components/support-header";
import WhatsappCard from "@/app/(protected-administrator)/support/_components/whatsapp-card";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { AccessWhitoutPlan } from "@/components/ui/acess-without-plan";

export const metadata: Metadata = {
  title: "Suporte - Nossa Aplicação",
  description: "Entre em contato com nossa equipe de suporte",
};

const SupportPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session.user.enterprise) {
    redirect("/enterprise-form");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <SupportHeader />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <WhatsappCard />
        <EmailCard />
      </div>
    </div>
  );
};

export default SupportPage;
