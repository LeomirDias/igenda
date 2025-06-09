interface ClientLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        slug: string;
    }>;
}

export default async function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <html>
            <body>{children}</body>
        </html>
    );
} 