import { Tags } from "lucide-react";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

interface TopServicesProps {
    topServices: {
        id: string;
        name: string;
        appointments: number;
    }[];
}

export default function TopServices({ topServices }: TopServicesProps) {
    return (
        <Card className="mx-auto w-full">
            <CardContent>
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Tags className="text-muted-foreground" />
                        <CardTitle className="text-base">Serviços</CardTitle>
                        <CardDescription>
                            Ranking de serviços mais agendados
                        </CardDescription>
                    </div>
                </div>

                {/* Doctors List */}
                <div className="space-y-6">
                    {[...topServices]
                        .sort((a, b) => b.appointments - a.appointments)
                        .map((service) => (
                            <div key={service.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h3 className="text-sm">{service.name}</h3>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-muted-foreground text-sm font-medium">
                                        {service.appointments} agend.
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </CardContent>
        </Card>
    );
}