import { and, eq, gt } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { verificationsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import SetPassworForm from "./_components/set-password-form";

const AuthenticationPage = async ({
  searchParams,
}: {
  searchParams: { token?: string };
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  // Verificar se o token existe na URL
  if (!searchParams.token) {
    redirect("/authentication?error=token-missing");
  }

  // Verificar se o token é válido
  const verification = await db
    .select()
    .from(verificationsTable)
    .where(
      and(
        eq(verificationsTable.value, searchParams.token),
        gt(verificationsTable.expiresAt, new Date())
      )
    )
    .limit(1);

  if (!verification.length) {
    redirect("/authentication?error=invalid-token");
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-md flex-col items-center sm:max-w-lg md:max-w-xl">
        <div className="mb-6 flex justify-center sm:mb-8">
          <Image
            src="/LogoCompletaiGenda.png"
            alt="iGenda Logo"
            width={400}
            height={80}
            className="h-42 w-auto"
            priority
          />
        </div>
        <SetPassworForm />
      </div>
    </div>
  );
};

export default AuthenticationPage;
