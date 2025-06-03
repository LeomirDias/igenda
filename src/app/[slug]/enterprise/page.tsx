import { PageContainer, PageHeader, PageHeaderContent, PageTitle, PageDescription, PageContent } from "@/components/ui/page-container";
import NavigationButtons from "../services/_components/navigation-buttons";

export default async function EnterprisePage({ params, }: { params: Promise<{ slug: string }> }) {

    const { slug } = await params;

    return (
        <PageContainer>
            <PageContent>
                <h1>Página da empresa</h1>
            </PageContent>
        </PageContainer>
    );
}