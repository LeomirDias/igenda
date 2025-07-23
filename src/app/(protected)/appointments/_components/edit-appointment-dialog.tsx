import { Dialog, DialogContent } from "@/components/ui/dialog";
import UpsertAppointmentForm from "./upsert-appointment-form";
import dayjs from "dayjs";
import { AppointmentWithRelations } from "./appointment-card";
import { clientsTable, professionalsTable, servicesTable } from "@/db/schema";

interface EditAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string | null;
  appointments: AppointmentWithRelations[];
  clients: (typeof clientsTable.$inferSelect)[];
  professionals: (typeof professionalsTable.$inferSelect)[];
  services: (typeof servicesTable.$inferSelect)[];
  onSuccess: () => void;
}

export const EditAppointmentDialog: React.FC<EditAppointmentDialogProps> = ({
  open,
  onOpenChange,
  appointmentId,
  appointments,
  clients,
  professionals,
  services,
  onSuccess,
}) => {
  const appointment = appointments.find((ap) => ap.id === appointmentId);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        {appointmentId && appointment && (
          <UpsertAppointmentForm
            isOpen={open}
            clients={clients}
            professionals={professionals}
            services={services}
            appointment={{
              id: appointment.id,
              clientId: appointment.client.id,
              professionalId: appointment.professional.id,
              serviceId: appointment.service.id,
              date:
                typeof appointment.date === "string"
                  ? appointment.date
                  : dayjs(appointment.date).format("YYYY-MM-DD"),
              time: appointment.time,
            }}
            onSuccess={onSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
