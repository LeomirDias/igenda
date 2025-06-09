import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import getDashboard from "@/data/get-dashboard";
import { auth } from "@/lib/auth";

import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import { AppointmentsChart } from "./_components/appoitments-chart";
import { DatePicker } from "./_components/date-picker";
import StatsCards from "./_components/stats-cards";
import TopProfessionals from "./_components/top-professionals";
import TopServices from "./_components/top-services";

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
    if (!session.user.enterprise) {
        redirect("/enterprise-form");
    }
    if (!session.user.plan) {
        redirect("/subscription-plans");
    }

    const { from, to } = await searchParams;

    if (!from || !to) {
        redirect(
            `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
        );
    }

    const { totalRevenue, totalAppointments, totalClients, totalProfessionals, topProfessionals, topServices, todayAppointments, dailyAppointmentsData } =
        await getDashboard({
            from,
            to,
            session: { user: { enterprise: { id: session.user.enterprise.id } } },
        });

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
            <div className="grid grid-cols-[2.25fr_1fr] gap-4">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Calendar className="text-muted-foreground" />
                            <CardTitle className="text-base">
                                Agendamentos de hoje
                            </CardTitle>
                            <CardDescription>
                                Aqui estão os agendamentos de hoje
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={appointmentsTableColumns} data={todayAppointments} />
                    </CardContent>
                </Card>
                <TopProfessionals professionals={topProfessionals} />
            </div>
            <div className="grid grid-cols-[2.25fr_1fr] gap-4">
                <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
                <TopServices topServices={topServices} />
            </div>

        </PageContainer>
    );
}

export default DashboardPage;