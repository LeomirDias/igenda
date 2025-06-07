import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clientAuthMiddleware } from "./middleware/client-auth";

export async function middleware(request: NextRequest) {
    // Rotas que exigem autenticação do cliente
    if (request.nextUrl.pathname.startsWith("/client")) {
        return clientAuthMiddleware(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/client/:path*", // Protege todas as rotas que começam com /client
    ],
}; 