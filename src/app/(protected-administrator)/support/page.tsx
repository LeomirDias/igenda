import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import SupportHeader from "@/app/(protected-administrator)/support/_components/support-header";
import WhatsappCard from "@/app/(protected-administrator)/support/_components/whatsapp-card";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "iGenda - Suporte"
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
      <div className="flex w-full items-center justify-center">
        <WhatsappCard />
      </div>
    </div>
  );
};

export default SupportPage;
