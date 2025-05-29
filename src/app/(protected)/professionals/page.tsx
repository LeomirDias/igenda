import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"

const ProfessionalsPage = () => {
    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Profissionais</PageTitle>
                    <PageDescription>Gerencie os profissionais da sua empresa.</PageDescription>
                </PageHeaderContent>
                <PageActions>
                    <Button>
                        <Plus />
                        Adicionar profissional
                    </Button>
                </PageActions>
            </PageHeader>
            <PageContent>
                <p>Em breve, você poderá gerenciar os profissionais da sua empresa.</p>
            </PageContent>
        </PageContainer>
    );
}

export default ProfessionalsPage;