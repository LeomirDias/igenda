import React from 'react';

export default function EnterpriseSlugLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="pt-BR">
            <body>
                {/* Aqui você pode adicionar um header/navbar bem simples específico para clientes */}
                <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                    {/* 
            Idealmente, você buscaria os dados da empresa aqui (pelo slug nos params)
            para exibir informações como nome da empresa, logo, etc. no layout.
            Exemplo: const enterprise = await getEnterpriseBySlug(params.slug);
          */}
                    <h1>Página da Empresa</h1> {/* Exemplo, pode ser dinâmico com o nome da empresa */}
                    {children}
                </main>
                {/* Aqui você pode adicionar um footer específico para clientes */}
            </body>
        </html>
    );
} 