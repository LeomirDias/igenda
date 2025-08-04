import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import SubscriptionPlan from "@/app/(protected-administrator)/subscription/_components/subscription-plan";
import { auth } from "@/lib/auth";

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session?.user.enterprise) {
    redirect("/enterprise-form");
  }
  if (session.user.plan) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8 flex justify-center">
        <Image
          src="/LogoiGenda.png"
          alt="iGenda Logo"
          width={120}
          height={120}
          className="h-auto w-auto"
          priority
        />
      </div>
      <div className="w-full max-w-sm sm:max-w-md">
        <SubscriptionPlan
          active={session.user.plan === "active"}
          userEmail={session.user.email}
        />
      </div>
    </div>
  );
};
export default SubscriptionPage;
