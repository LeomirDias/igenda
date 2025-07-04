import { Users } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

interface TopProfessionalsProps {
    professionals: {
        id: string;
        name: string;
        avatarImageUrl: string | null;
        specialty: string;
        appointments: number;
    }[];
}

export default function TopProfessionals({ professionals }: TopProfessionalsProps) {
    return (
        <Card className="mx-auto w-full">
            <CardContent>
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Users className="text-muted-foreground" />
                        <CardTitle className="text-base">Profissionais</CardTitle>
                        <CardDescription>
                            Ranking de profissionais mais agendados
                        </CardDescription>
                    </div>
                </div>

                {/* Doctors List */}
                <div className="space-y-6">
                    {[...professionals]
                        .sort((a, b) => b.appointments - a.appointments)
                        .map((professional) => (
                            <div key={professional.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16 relative border-1 border-gray-200 rounded-full">
                                        {professional.avatarImageUrl ? (
                                            <Image
                                                src={professional.avatarImageUrl}
                                                alt={professional.name}
                                                fill
                                                style={{ objectFit: "cover" }}
                                                className="rounded-full"
                                            />
                                        ) : (
                                            <AvatarFallback>
                                                {professional.name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")
                                                    .slice(0, 2)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div>
                                        <h3 className="text-sm">{professional.name}</h3>
                                        <p className="text-muted-foreground text-sm">
                                            {professional.specialty}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-muted-foreground text-sm font-medium">
                                        {professional.appointments} agend.
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </CardContent>
        </Card>
    );
}