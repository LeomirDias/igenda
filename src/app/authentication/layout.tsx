import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "iGenda - Autenticação",
};

export default function AuthenticationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="dark min-h-screen bg-[#202020]">{children}</div>;
}
