import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { auth } from "@/lib/auth";

import ValidSubscriptionForm from "./_components/valid-subscription-form";

export const metadata: Metadata = {
    title: "iGenda - Validação de assinatura",
};

const EnterpriseFormPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/authentication");
    }
    if (session.user.docNumber) {
        redirect("/dashboard");
    }

    return (
        <Dialog open>
            <DialogContent className="max-h-[95vh] w-[95vw] max-w-[500px] overflow-y-auto p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle>Validar assinatura</DialogTitle>
                    <DialogDescription>
                        Informe seu CPF e telefone para validar sua assinatura e começar a usar nosso sistema de agendamento.
                    </DialogDescription>
                </DialogHeader>
                <ValidSubscriptionForm />
            </DialogContent>
        </Dialog>
    );
};

export default EnterpriseFormPage;
