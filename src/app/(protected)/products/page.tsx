import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import { db } from "@/db";
import { clientsTable, productsTable, servicesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import AddProductButton from "./_components/add-product-button";

const ProductsPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/authentication");
    }
    if (!session?.user.enterprise) {
        redirect("/enterprise-form");
    }

    const products = await db.query.productsTable.findMany({
        where: eq(productsTable.enterpriseId, session.user.enterprise.id),
    })

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Produtos</PageTitle>
                    <PageDescription>Visualize e gerencie os produtos em seu estoque.</PageDescription>
                </PageHeaderContent>
                <PageActions>
                    <AddProductButton />
                </PageActions>
            </PageHeader>
            <PageContent>
                <div className="grid grid-cols-6 gap-6">
                    {/*{products.map(service => <ServiceCard key={service.id} service={service} />)}*/}
                </div>
            </PageContent>
        </PageContainer>
    );
}

export default ProductsPage;