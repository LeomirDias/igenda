import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import EnterpriseForm from "./components/enterprise-form";

const EnterpriseFormPage = () => {


    return (
        <Dialog open>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Quase lá!</DialogTitle>
                    <DialogDescription>
                        Cadastre sua empresa para começar a usar nosso sistema de agendamento.
                    </DialogDescription>
                </DialogHeader>
                <EnterpriseForm />
            </DialogContent>
        </Dialog>
    );
}

export default EnterpriseFormPage;