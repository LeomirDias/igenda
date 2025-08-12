import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AccessWhitoutPlan } from "@/components/ui/acess-without-plan";
import { LauchingSoon } from "@/components/ui/launching-soon";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "iGenda - Tutoriais",
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
  if (!session.user.docNumber) {
    redirect("/valid-subscription");
  }
  if (session.user.subscriptionStatus !== "active") {
    return <AccessWhitoutPlan />;
  }

  return (
    <div className="h-full w-full">
      <LauchingSoon />
    </div>
  );
};

export default SupportPage;
