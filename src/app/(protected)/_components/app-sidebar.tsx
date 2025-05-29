"use client";

import { BookUser, BotMessageSquare, Box, Calendar, Headphones, LayoutDashboard, LinkIcon, LogOutIcon, PlaySquareIcon, Settings, Tag, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"


// Menu items.
const itemsEnterprise = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Agendamentos",
        url: "/appointments",
        icon: Calendar,
    },
    {
        title: "Profissionais",
        url: "/professionals",
        icon: Users,
    },
    {
        title: "Serviços",
        url: "/services",
        icon: Tag,
    },
    {
        title: "Estoque",
        url: "/inventory",
        icon: Box,
    },
]

const itemsClients = [
    {
        title: "Clientes",
        url: "/clients",
        icon: BookUser,
    },
    {
        title: "Mensagens",
        url: "/messages",
        icon: BotMessageSquare,
    },
    {
        title: "Link de agendamento",
        url: "/booking-link",
        icon: LinkIcon,
    },
]

const othersItems = [
    {
        title: "Suporte iGenda",
        url: "/support",
        icon: Headphones,
    },
    {
        title: "Tutoriais",
        url: "/tutorials",
        icon: PlaySquareIcon,
    },
    {
        title: "Ajustes",
        url: "/settings",
        icon: Settings,
    },
]

export function AppSidebar() {

    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/authentication");
                },
            },
        });
    };

    return (
        <Sidebar>
            <SidebarHeader className="p-4 border-b flex items-center justify-center">
                <Image src="/Logo.svg" alt="iGenda" width={128} height={28} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Minha empresa</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {itemsEnterprise.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Clientes</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {itemsClients.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Outros</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {othersItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>Empresa</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={handleSignOut}>
                                    <LogOutIcon />Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
