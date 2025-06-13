import { cookies } from "next/headers";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card"
import { getClientFromToken } from "@/middleware/client-auth";

const PublicPagesHeader = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;
    const client = await getClientFromToken(token!);

    if (!client) {
        return null;
    }


    const enterpriseInitials = client?.enterprise?.name
        .split(" ")
        .map((name) => name[0])
        .join("");

    return (
        <Card className="w-full border-none rounded-none">
            <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="h-18 w-18">
                        <AvatarFallback>
                            {enterpriseInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {client?.enterprise?.name || "..."}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Seja bem vindo à iGenda de {client?.enterprise?.name || "..."}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default PublicPagesHeader;