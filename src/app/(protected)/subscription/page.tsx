import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container";
import SubscriptionPlan from "./_components/subscription-plan";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const SubscriptionPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/authentication");
    }
    if (!session?.user.enterprise) {
        redirect("/enterprise-form");
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Planos</PageTitle>
                    <PageDescription>Visualize e gerencie os planos disponíveis.</PageDescription>
                </PageHeaderContent>
            </PageHeader>
            <PageContent>
                <SubscriptionPlan className="w-[350px]" active={session.user.plan === "essential"} userEmail={session.user.email} />
            </PageContent>
        </PageContainer>
    );
}
export default SubscriptionPage;