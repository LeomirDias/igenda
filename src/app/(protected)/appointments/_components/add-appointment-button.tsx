"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { clientsTable, professionalsTable, servicesTable } from "@/db/schema";

import AddAppointmentForm from "./add-appointment-form";

interface AddAppointmentButtonProps {
    clients: (typeof clientsTable.$inferSelect)[];
    professionals: (typeof professionalsTable.$inferSelect)[];
    services: (typeof servicesTable.$inferSelect)[];
}

const AddAppointmentButton = ({
    clients,
    professionals,
    services,
}: AddAppointmentButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Novo agendamento
                </Button>
            </DialogTrigger>
            <AddAppointmentForm
                isOpen={isOpen}
                clients={clients}
                professionals={professionals}
                services={services}
                onSuccess={() => setIsOpen(false)}
            />
        </Dialog>
    );
};

export default AddAppointmentButton;