import { Calendar, Clock, Home, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SlugPageFooter, SlugPageFooterActions, SlugPageFooterContent } from "@/components/ui/slug-page-container";

const SlugPagesFooter = () => {
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
                            <Calendar />
                            Agendamentos
                        </Button>
                        <Button variant="ghost" className="flex flex-col items-center justify-center gap-1 mt-1 text-muted-foreground text-xs">
                            <Clock />
                            Agendar
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

export default SlugPagesFooter;