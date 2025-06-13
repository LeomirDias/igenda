import { Clock, Home, Store, User } from "lucide-react";
import { cookies } from "next/headers";

import { Button } from "@/components/ui/button";
import { SlugPageFooter, SlugPageFooterActions, SlugPageFooterContent } from "@/components/ui/slug-page-container";
import { getClientFromToken } from "@/middleware/client-auth";

const PublicPagesFooter = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;
    const client = await getClientFromToken(token!);

    if (!client) {
        return null;
    }
    return (
        <SlugPageFooter>
            <SlugPageFooterContent>
                <SlugPageFooterActions>
                    <div className="flex flex-row w-full justify-between">
                        <Button variant="ghost" className="flex flex-col items-center justify-center gap-1 mt-1 text-muted-foreground text-xs">
                            <Home />
                            Início
                        </Button>
                        <Button variant="ghost" className="flex flex-col items-center justify-center gap-1 mt-1 text-muted-foreground text-xs">
                            <Clock />
                            Agendar
                        </Button>
                        <Button variant="ghost" className="flex flex-col items-center justify-center gap-1 mt-1 text-muted-foreground text-xs">
                            <Store />
                            {client?.enterprise?.name || "..."}
                        </Button>
                        <Button variant="ghost" className="flex flex-col items-center justify-center gap-1 mt-1 text-muted-foreground text-xs">
                            <User />
                            Perfil
                        </Button>
                    </div>
                </SlugPageFooterActions>
            </SlugPageFooterContent>
        </SlugPageFooter>
    );
}

export default PublicPagesFooter;