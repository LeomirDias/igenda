import { db } from "@/db";
import { clientSessionsTable, clientsTable } from "@/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function getClientFromToken(token: string) {
    const now = new Date();

    const session = await db.query.clientSessionsTable.findFirst({
        where: (s, { and, eq, gt }) =>
            and(
                eq(s.token, token),
                gt(s.expiresAt, now)
            ),
        with: {
            client: {
                with: {
                    enterprise: true,
                },
            },
        },
    });

    return session?.client || null;
}

export async function clientAuthMiddleware(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/client-login", request.url));
    }

    const client = await getClientFromToken(token);

    if (!client) {
        cookieStore.delete("client_token");
        return NextResponse.redirect(new URL("/client-login", request.url));
    }

    return NextResponse.next();
} 