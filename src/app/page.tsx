import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const HomePage = async () => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session?.user.enterprise) {
    redirect("/enterprise-form");
  }
  else {
    redirect("/dashboard");
  }

  return (
    <h1>Página Inicial</h1>
  );
}

export default HomePage;