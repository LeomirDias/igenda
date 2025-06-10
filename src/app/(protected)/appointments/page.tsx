import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DataTable } from "@/components/ui/data-table";
import {
    PageActions,
    PageContainer,
    PageContent,
    PageDescription,
    PageHeader,
    PageHeaderContent,
    PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { appointmentsTable, clientsTable, professionalsTable, servicesTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddAppointmentButton from "./_components/add-appointment-button";
import { appointmentsTableColumns } from "./_components/table-columns";

const AppointmentsPage = async () => {
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

    const [clients, professionals, appointments, services] = await Promise.all([
        db.query.clientsTable.findMany({
            where: eq(clientsTable.enterpriseId, session.user.enterprise.id),
        }),
        db.query.professionalsTable.findMany({
            where: eq(professionalsTable.enterpriseId, session.user.enterprise.id),
        }),
        db.query.appointmentsTable.findMany({
            where: eq(appointmentsTable.enterpriseId, session.user.enterprise.id),
            with: {
                client: true,
                professional: true,
                service: true,
            },
        }),
        db.query.servicesTable.findMany({
            where: eq(servicesTable.enterpriseId, session.user.enterprise.id),
        }),
    ]);

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Agendamentos</PageTitle>
                    <PageDescription>
                        Gerencie os agendamentos da sua empresa
                    </PageDescription>
                </PageHeaderContent>
                <PageActions>
                    <AddAppointmentButton
                        clients={clients}
                        professionals={professionals}
                        services={services}
                    />
                </PageActions>
            </PageHeader>
            <PageContent>
                <DataTable
                    data={appointments.map(appointment => ({
                        ...appointment,
                        client: {
                            id: appointment.client.id,
                            name: appointment.client.name,
                            email: appointment.client.phoneNumber, // Usando phoneNumber como email temporariamente
                            phoneNumber: appointment.client.phoneNumber
                        },
                        professional: {
                            id: appointment.professional.id,
                            name: appointment.professional.name,
                            specialty: appointment.professional.specialty
                        },
                        service: {
                            id: appointment.service.id,
                            name: appointment.service.name,
                            servicePriceInCents: appointment.service.servicePriceInCents
                        }
                    }))}
                    columns={appointmentsTableColumns}
                />
            </PageContent>
        </PageContainer>
    );
};

export default AppointmentsPage;