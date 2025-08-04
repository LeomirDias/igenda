import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { auth } from "@/lib/auth";

import SubscriptionPlan from "./_components/subscription-plan";

const SubscriptionPage = async () => {
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
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>
            Visualize e gerencie sua assinatura.
          </PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <SubscriptionPlan
          className="w-[350px]"
          active={session.user.plan === "active"}
          userEmail={session.user.email}
        />
      </PageContent>
    </PageContainer>
  );
};
export default SubscriptionPage;
