import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { usersToEnterprisesTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import SignOutButton from "./_components/sign-out-button";


const DashboardPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/authentication");
    }

    const enterprises = await db.query.usersToEnterprisesTable.findMany({
        where: eq(usersToEnterprisesTable.userId, session.user.id),
    });

    if (enterprises.length === 0) {
        redirect("/enterprise-form");
    }

    return (
        <div>
            <h1>{session?.user?.name}</h1>
            <h1>{session?.user?.email}</h1>
            <SignOutButton />
        </div>
    );
}

export default DashboardPage;