import dayjs from "dayjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import getDashboard from "@/data/get-dashboard";
import { auth } from "@/lib/auth";

import { AppointmentsChart } from "./_components/appoitments-chart";
import { DatePicker } from "./_components/date-picker";
import { RevenueChart } from "./_components/revenue-chart";
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

  const {
    totalRevenue,
    totalAppointments,
    totalClients,
    totalProfessionals,
    topProfessionals,
    topServices,
    dailyAppointmentsData,
  } = await getDashboard({
    from,
    to,
    session: { user: { enterprise: { id: session.user.enterprise.id } } },
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Dashboard</PageTitle>
          <PageDescription>
            Tenha uma visão geral do seu negócio.
          </PageDescription>
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
      <div className="grid grid-cols-2 gap-4">
        <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
        <RevenueChart dailyAppointmentsData={dailyAppointmentsData} />
      </div>
      <div className="grid grid-cols-[2.25fr_1fr] gap-4">
        <TopProfessionals professionals={topProfessionals} />
        <TopServices topServices={topServices} />
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
