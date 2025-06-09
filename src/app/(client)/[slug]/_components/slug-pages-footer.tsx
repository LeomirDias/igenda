import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SlugPageFooter, SlugPageFooterActions, SlugPageFooterContent } from "@/components/ui/slug-page-container";

const SlugPagesFooter = () => {
    return (
        <SlugPageFooter>
            <SlugPageFooterContent>
                <SlugPageFooterActions>
                    <Button>
                        <Calendar />
                    </Button>
                </SlugPageFooterActions>
            </SlugPageFooterContent>
        </SlugPageFooter>
    );
}

export default SlugPagesFooter;