import { PageContainer, PageHeader, PageHeaderContent, PageTitle, PageDescription, PageContent } from "@/components/ui/page-container";
import NavigationButtons from "./services/_components/navigation-buttons";


export default async function HomePage({ params, }: { params: { slug: string } }) {

    const { slug } = params;

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Sobre nós</PageTitle>
                    <PageDescription>Verifique informações importantes como endereço, contato e entre outros.</PageDescription>
                </PageHeaderContent>
            </PageHeader>
            <PageContent>
                <h1>teste</h1>
            </PageContent>
            <PageContent>
                <NavigationButtons params={{ slug }} />
            </PageContent>
        </PageContainer>
    );
}