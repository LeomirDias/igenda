import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import UpsertProfessionalForm from "./upsert-professional-form";

const AddProfessionalButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    Adicionar profissonal
                </Button>
            </DialogTrigger>
            <UpsertProfessionalForm />
        </Dialog>
    );
}

export default AddProfessionalButton;