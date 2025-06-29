"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Store, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateEnterprise } from "@/actions/update-enterprise";
import { UpdateEnterpriseSchema, updateEnterpriseSchema } from "@/actions/update-enterprise/schema";
import { uploadEnterpriseProfilePicture } from "@/actions/upsert-enterprise-profile-picture";
import { enterpriseSpecialty } from "@/app/(protected)/enterprise-form/_constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { enterprisesTable } from "@/db/schema";

// const formSchema = z.object({
//     name: z.string().trim().min(1, { message: "Nome da empresa é obrigatório." }),
//     specialty: z.string().trim().min(1, { message: "Área de atuação é obrigatória." }),
//     phoneNumber: z.string().trim().min(1, { message: "Telefone da empresa é obrigatório." }),
//     register: z.string().trim().min(1, { message: "Registro da empresa é obrigatório." }),
//     instagramURL: z.string().trim().url({ message: "URL do Instagram inválida." }),
//     cep: z.string().trim().min(1, { message: "CEP da empresa é obrigatório." }),
//     address: z.string().trim().min(1, { message: "Endereço da empresa é obrigatório." }),
//     number: z.string().trim().min(1, { message: "Número da empresa é obrigatório." }),
//     complement: z.string().trim().optional(),
//     city: z.string().trim().min(1, { message: "Cidade da empresa é obrigatória." }),
//     state: z.string().trim().min(1, { message: "Estado da empresa é obrigatório." }),
// })

interface EnterpriseCardProps {
    enterprise?: typeof enterprisesTable.$inferSelect;
}

const EnterpriseCard = ({ enterprise }: EnterpriseCardProps) => {
    const [isCepLoading, setIsCepLoading] = useState(false);
    const router = useRouter();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(enterprise?.avatarImageURL || null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File>();

    const { execute: executeUpdateEnterprise } = useAction(updateEnterprise);

    const form = useForm<UpdateEnterpriseSchema>({
        shouldUnregister: true,
        resolver: zodResolver(updateEnterpriseSchema),
        defaultValues: {
            name: enterprise?.name || "",
            specialty: enterprise?.specialty || "",
            phoneNumber: enterprise?.phoneNumber || "",
            register: enterprise?.register || "",
            instagramURL: enterprise?.instagramURL || "",
            cep: enterprise?.cep || "",
            address: enterprise?.address || "",
            number: enterprise?.number || "",
            complement: enterprise?.complement || "",
            city: enterprise?.city || "",
            state: enterprise?.state || "",
        },
    });

    const upsertEnterpriseAction = useAction(updateEnterprise, {
        onSuccess: () => {
            toast.success(enterprise ? "Empresa atualizada com sucesso!" : "Empresa adicionada com sucesso!");
            form.reset();
            window.location.reload();
        },
        onError: (error) => {
            console.error("Erro ao salvar empresa:", error);
            toast.error(enterprise ? `Erro ao atualizar empresa.` : `Erro ao adicionar empresa.`);
        },
    });

    const cep = form.watch("cep");

    useEffect(() => {
        const fetchAddressFromCep = async (cep: string) => {
            const formattedCep = cep.replace(/\D/g, "");
            if (formattedCep.length === 8) {
                setIsCepLoading(true);
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${formattedCep}/json/`);
                    if (!response.ok) {
                        throw new Error("CEP não encontrado");
                    }
                    const data = await response.json();
                    if (data.erro) {
                        toast.error("CEP não encontrado. Verifique o CEP digitado.");
                        form.setValue("address", "", { shouldValidate: true });
                        form.setValue("city", "", { shouldValidate: true });
                        form.setValue("state", "", { shouldValidate: true });
                        form.setValue("complement", "", { shouldValidate: true });
                    } else {
                        form.setValue("address", data.logradouro, { shouldValidate: true });
                        form.setValue("city", data.localidade, { shouldValidate: true });
                        form.setValue("state", data.uf, { shouldValidate: true });
                        toast.success("Endereço preenchido automaticamente!");
                    }
                } catch (error) {
                    console.error("Erro ao buscar CEP:", error);
                    toast.error("Erro ao buscar CEP. Tente novamente.");
                    form.setValue("address", "", { shouldValidate: true });
                    form.setValue("city", "", { shouldValidate: true });
                    form.setValue("state", "", { shouldValidate: true });
                } finally {
                    setIsCepLoading(false);
                }
            }
        };

        if (cep) {
            fetchAddressFromCep(cep);
        }
    }, [cep, form]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: UpdateEnterpriseSchema) => {
        try {
            await executeUpdateEnterprise({
                id: enterprise?.id,
                name: data.name,
                specialty: data.specialty,
                phoneNumber: data.phoneNumber,
                register: data.register,
                instagramURL: data.instagramURL,
                cep: data.cep,
                address: data.address,
                number: data.number,
                complement: data.complement,
                city: data.city,
                state: data.state,
            });

            if (avatarFile) {
                setIsUploadingAvatar(true);
                try {
                    const formData = new FormData();
                    formData.append('photo', avatarFile);
                    await uploadEnterpriseProfilePicture(formData, enterprise?.id || "");
                } catch (error) {
                    console.error("Erro ao fazer upload da imagem:", error);
                    toast.error("Erro ao fazer upload da imagem. A empresa foi atualizada, mas a imagem não foi salva.");
                } finally {
                    setIsUploadingAvatar(false);
                }
            }

            toast.success("Empresa atualizada com sucesso!");
            router.push("/settings");
        } catch (error) {
            console.error("Erro ao atualizar empresa:", error);
            toast.error("Erro ao atualizar empresa. Por favor, tente novamente.");
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary" />
                    <CardTitle>Dados da Empresa</CardTitle>
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="relative h-24 w-24 overflow-hidden bg-muted border-1 border-gray-200 rounded-full">
                                {avatarPreview ? (
                                    <Image
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <FormLabel>Foto da empresa</FormLabel>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    disabled={isUploadingAvatar}
                                />
                                {isUploadingAvatar && (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span className="text-sm text-muted-foreground">Enviando imagem...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da Empresa</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="specialty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Área de atuação</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione sua área de atuação..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {enterpriseSpecialty.map((specialty) => (
                                                    <SelectItem key={specialty.value} value={specialty.value}>
                                                        {specialty.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefone</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="register"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Registro</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="instagramURL"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Instagram</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cep"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input {...field} />
                                                {isCepLoading && (
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Endereço</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isCepLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="complement"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Complemento</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cidade</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isCepLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isCepLoading} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={upsertEnterpriseAction.isPending}>
                                {upsertEnterpriseAction.isPending
                                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                                    : enterprise ? "Editar empresa"
                                        : "Cadastrar empresa"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default EnterpriseCard;