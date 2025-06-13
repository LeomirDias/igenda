import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { eq } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { cookies } from "next/headers";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/db";
import { appointmentsTable } from "@/db/schema";
import { getClientFromToken } from "@/middleware/client-auth";


const LastAppointmentsCard = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;
    const client = await getClientFromToken(token!);

    if (!client) {
        return null;
    }

    const lastAppointments = await db.query.appointmentsTable.findMany({
        where: eq(appointmentsTable.clientId, client.id),
        orderBy: desc(appointmentsTable.createdAT),
        with: {
            service: true,
            professional: true
        }
    });

    return (
        <>
            <h1 className="text-lg font-bold">Últimos agendamentos</h1>
            <div className="flex flex-col gap-4">
                {lastAppointments?.map((appointment) => {
                    const professionalInitials = appointment.professional?.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("");

                    return (
                        <Card key={appointment.id} className="p-4">
                            <CardContent className="flex justify-between p-0">
                                <div className="flex flex-col gap-2 py-3">
                                    <Badge>Confirmado</Badge>
                                    <h3 className="text-md font-semibold">{appointment.service?.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>
                                                {professionalInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="text-muted-foreground">{appointment.professional?.name}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center px-5 border-l-2 border-solid">
                                    <p className="text-sm">{format(new Date(appointment.date), "MMMM", { locale: ptBR })}</p>
                                    <p className="text-2xl">{format(new Date(appointment.date), "dd")}</p>
                                    <p className="text-sm">{format(new Date(appointment.date), "HH:mm", { locale: ptBR })}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </>
    );
};

export default LastAppointmentsCard;