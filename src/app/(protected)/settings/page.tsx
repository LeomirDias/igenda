import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import { auth } from "@/lib/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import UserCard from "./_components/user-card";

const SettingsPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/authentication");
    }
    if (!session.user.enterprise) {
        redirect("/enterprise-form");
    }
    if (!session.user.plan) {
        redirect("/subscription-plans");
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Ajustes</PageTitle>
                    <PageDescription>Visualize e gerencie os ajustes da sua conta e da sua empresa.</PageDescription>
                </PageHeaderContent>
            </PageHeader>
            <PageContent>
                <div className="grid grid-cols-[2.25fr_1fr] gap-4">
                    <UserCard user={session.user} />
                    <></>
                </div>
            </PageContent>
        </PageContainer>
    );
}

export default SettingsPage;