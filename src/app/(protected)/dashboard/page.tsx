import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import { auth } from "@/lib/auth";

import { DatePicker } from "./_components/date-picker";
import { appointmentsTable, professionalsTable, clientsTable } from "@/db/schema";
import { and, count, eq, gte, lte, sum } from "drizzle-orm";
import { db } from "@/db";
import StatsCards from "./_components/stats-cards";
import dayjs from "dayjs";

interface DashboardPageProps {
    searchParams: Promise<{
        from: string;
        to: string;
    }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/authentication");
    }

    if (!session?.user.enterprise) {
        redirect("/enterprise-form");
    }

    const { from, to } = await searchParams;

    if (!from || !to) {
        redirect(
            `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
        );
    }

    const [
        [totalRevenue],
        [totalAppointments],
        [totalClients],
        [totalProfessionals]
    ] = await Promise.all([
        db.select({
            total: sum(appointmentsTable.appointmentPriceInCents),
        })
            .from(appointmentsTable)
            .where(
                and(
                    eq(appointmentsTable.enterpriseId, session.user.enterprise.id),
                    gte(appointmentsTable.date, new Date(from)),
                    lte(appointmentsTable.date, new Date(to)),
                )
            ),

        db.select({
            total: count(appointmentsTable.id),
        })
            .from(appointmentsTable)
            .where(
                and(
                    eq(appointmentsTable.enterpriseId, session.user.enterprise.id),
                    gte(appointmentsTable.date, new Date(from)),
                    lte(appointmentsTable.date, new Date(to)),
                )
            ),

        db.select({
            total: count(),
        })
            .from(clientsTable)
            .where(
                and(
                    eq(clientsTable.enterpriseId, session.user.enterprise.id),
                )
            ),

        db.select({
            total: count(),
        })
            .from(professionalsTable)
            .where(
                and(
                    eq(professionalsTable.enterpriseId, session.user.enterprise.id),
                )
            )
    ]);

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Dashboard</PageTitle>
                    <PageDescription>Tenha uma visão geral do seu negócio.</PageDescription>
                </PageHeaderContent>
                <PageActions>
                    <DatePicker />
                </PageActions>
            </PageHeader>
            <PageContent>
                <StatsCards
                    totalRevenue={totalRevenue.total ? Number(totalRevenue.total) : null}
                    totalAppointments={totalAppointments.total}
                    totalClients={totalClients.total}
                    totalProfessionals={totalProfessionals.total}
                />
            </PageContent>
        </PageContainer>
    );
}

export default DashboardPage;