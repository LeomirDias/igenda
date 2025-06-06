"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { updateUserName } from "@/actions/update-user-name";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { schema } from "@/actions/update-user-name/schema";
import { User } from "lucide-react";

interface UserCardProps {
    user: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
        plan?: string | null;
    };
}

const UserCard = ({ user }: UserCardProps) => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: user.name,
        },
    });

    const { execute: executeUpdateUserName, status } = useAction(updateUserName, {
        onSuccess: () => {
            toast.success("Nome atualizado com sucesso!");
        },
        onError: (error) => {
            toast.error("Erro ao atualizar nome. Tente novamente.");
        },
    });

    const onSubmit = (values: z.infer<typeof schema>) => {
        executeUpdateUserName(values);
    };

    const userInitials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        <CardTitle>Dados da Conta</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-16 w-16 relative">
                            {user.image ? (
                                <Image
                                    src={user.image}
                                    alt={user.name}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="rounded-full"
                                />
                            ) : (
                                <AvatarFallback className="text-lg">{userInitials}</AvatarFallback>
                            )}
                        </Avatar>
                        <div className="space-y-1">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={status === "executing"}
                                    >
                                        {status === "executing" ? "Salvando..." : "Salvar"}
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <Separator />
            <CardContent>
                <h3 className="font-medium mb-2">Informações da Conta</h3>
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Email: {user.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Plano: {user.plan ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1) : 'Sem plano'}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserCard;