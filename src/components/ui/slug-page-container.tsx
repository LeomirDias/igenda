export const PageContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full p-6 space-y-6 pb-24">
            {children}
        </div>
    );
}

export const PageHeader = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex w-full items-center justify-between ">
            {children}
        </div>
    );
}

export const PageHeaderContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="w-full space-y-1">
            {children}
        </div>
    );
}

export const PageTitle = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="text-2xl font-bold">
            {children}
        </div>
    );
}

export const PageDescription = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="text-sm text-muted-foreground">
            {children}
        </div>
    );
}

export const EnterpriseProfileImage = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex justify-center py-6">
            {children}
        </div>
    );
};

export const PagePrimaryActions = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-4">
            {children}
        </div>
    );
};

export const PageContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="space-y-6">
            {children}
        </div>
    );
}

export const PageFooter = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="fixed inset-x-0 bottom-0 bg-background border-t shadow-t-lg z-50">
            <div className="container mx-auto px-4 py-3">
                {children}
            </div>
        </div>
    );
}

export const PageFooterContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {children}
        </div>
    );
}

export const PageFooterActions = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-around gap-2">
            {children}
        </div>
    );
}


