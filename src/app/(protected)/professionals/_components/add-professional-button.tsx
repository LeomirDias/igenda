"use client"
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import CreateProfessionalForm from "./create-professional-form";

const AddProfessionalButton = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Adicionar profissonal
                </Button>
            </DialogTrigger>
            <CreateProfessionalForm onSuccess={() => setIsOpen(false)} />
        </Dialog>
    );
}

export default AddProfessionalButton;