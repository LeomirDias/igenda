import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import { auth } from "@/lib/auth";

import { DatePicker } from "./_components/date-picker";
import { appointmentsTable, professionalsTable, clientsTable, servicesTable } from "@/db/schema";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import StatsCards from "./_components/stats-cards";
import dayjs from "dayjs";
import { AppointmentsChart } from "./_components/appoitments-chart";
import TopProfessionals from "./_components/top-professionals";
import TopSpecialties from "./_components/top-services";
import TopServices from "./_components/top-services";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { appointmentsTableColumns } from "../appointments/_components/table-columns";

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
        [totalProfessionals],
        topProfessionals,
        topServices,
        todayAppointments,
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
            ),

        db.select({
            id: professionalsTable.id,
            name: professionalsTable.name,
            avatarImageUrl: professionalsTable.avatarImageURL,
            specialty: professionalsTable.specialty,
            appointments: count(appointmentsTable.id),
        })
            .from(professionalsTable)
            .leftJoin(appointmentsTable,
                and(
                    eq(appointmentsTable.professionalId, professionalsTable.id),
                    gte(appointmentsTable.date, new Date(from)),
                    lte(appointmentsTable.date, new Date(to)),
                )
            )
            .where(eq(professionalsTable.enterpriseId, session.user.enterprise.id))
            .groupBy(professionalsTable.id)
            .orderBy(desc(count(professionalsTable.name)))
            .limit(10),

        db.select({
            id: servicesTable.id,
            name: servicesTable.name,
            appointments: count(appointmentsTable.id),
        })
            .from(servicesTable)
            .leftJoin(appointmentsTable,
                and(
                    eq(appointmentsTable.serviceId, servicesTable.id),
                    gte(appointmentsTable.date, new Date(from)),
                    lte(appointmentsTable.date, new Date(to)),
                )
            )
            .where(eq(servicesTable.enterpriseId, session.user.enterprise.id))
            .groupBy(servicesTable.id)
            .orderBy(desc(count(servicesTable.name)))
            .limit(5),

        db.query.appointmentsTable.findMany({
            where: and(
                eq(appointmentsTable.enterpriseId, session.user.enterprise.id),
                gte(appointmentsTable.date, new Date(from)),
                lte(appointmentsTable.date, new Date(to)),
            ),
            with: {
                client: true,
                professional: true,
                service: true,
            }
        })

    ]);

    const chartStartDate = dayjs().subtract(10, 'days').startOf('day').toDate();
    const chartEndDate = dayjs().add(10, 'days').endOf('day').toDate();

    const dailyAppointmentsData = await db
        .select({
            date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
            appointments: count(appointmentsTable.id),
            revenue: sql<number>`COALESCE(SUM(${appointmentsTable.appointmentPriceInCents}), 0)`.as("revenue"),
        })
        .from(appointmentsTable)
        .where(
            and(
                eq(appointmentsTable.enterpriseId, session.user.enterprise.id),
                gte(appointmentsTable.date, chartStartDate),
                lte(appointmentsTable.date, chartEndDate),
            ),
        )
        .groupBy(sql`DATE(${appointmentsTable.date})`)
        .orderBy(sql`DATE(${appointmentsTable.date})`);

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