import { eq } from "drizzle-orm";
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
import { db } from "@/db";
import { clientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddClientButton from "./_components/add-client-button";
import { ClientsTable } from "./_components/clients-table";

const ClientsPage = async () => {
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

  const clients = await db.query.clientsTable.findMany({
    where: eq(clientsTable.enterpriseId, session.user.enterprise.id),
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Clientes</PageTitle>
          <PageDescription>
            Visualize e gerencie os clientes cadastrados na sua empresa.
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddClientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <ClientsTable clients={clients} />
      </PageContent>
    </PageContainer>
  );
};

export default ClientsPage;
