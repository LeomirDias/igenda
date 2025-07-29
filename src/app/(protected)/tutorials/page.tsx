import type { Metadata } from "next";

import EmailCard from "@/app/(protected)/support/_components/email-card";
import SupportHeader from "@/app/(protected)/support/_components/support-header";
import WhatsappCard from "@/app/(protected)/support/_components/whatsapp-card";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { AccessWhitoutPlan } from "@/components/ui/acess-without-plan";
import { LauchingSoon } from "@/components/ui/launching-soon";

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
    <div className="h-full w-full">
      <LauchingSoon />
    </div>
  );
};

export default SupportPage;
