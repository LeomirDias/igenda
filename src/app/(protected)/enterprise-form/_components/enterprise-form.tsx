"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { createEnterprise } from "@/actions/create-enterprise";
import { uploadEnterpriseProfilePicture } from "@/actions/upsert-enterprise-profile-picture";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { enterpriseSpecialty } from "../_constants";

const enterpriseFormSchema = z.object({
    name: z.string().trim().min(1, { message: "Nome da empresa é obrigatório." }),
    specialty: z.string().trim().min(1, { message: "Área de atuação da empresa é obrigatória." }),
    phoneNumber: z.string().trim().min(1, { message: "Telefone da empresa é obrigatório." }),
    register: z.string().trim().min(1, { message: "CPF do responsável ou CNPJ da empresa é obrigatório." }),
    instagramURL: z.string().trim().url({ message: "URL do Instagram inválida." }).or(z.literal("")),
    cep: z.string().trim().min(8, { message: "CEP deve conter 8 dígitos." }).max(9, { message: "CEP deve conter no máximo 9 caracteres com hífen." }),
    address: z.string().trim().min(1, { message: "Logradouro é obrigatório." }),
    number: z.string().trim().min(1, { message: "Número é obrigatório." }),
    complement: z.string().trim().optional(),
    city: z.string().trim().min(1, { message: "Cidade é obrigatória." }),
    state: z.string().trim().min(2, { message: "Estado é obrigatório e deve ter 2 caracteres." }).max(2, { message: "Estado deve ter 2 caracteres." }),
});

const EnterpriseForm = () => {
    const router = useRouter();
    const [isCepLoading, setIsCepLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File>();
    const [avatarPreview, setAvatarPreview] = useState<string>();
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    const form = useForm<z.infer<typeof enterpriseFormSchema>>({
        resolver: zodResolver(enterpriseFormSchema),
        defaultValues: {
            name: "",
            specialty: "",
            phoneNumber: "",
            register: "",
            instagramURL: "",
            cep: "",
            address: "",
            number: "",
            complement: "",
            city: "",
            state: "",
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
            } else if (formattedCep.length > 0 && formattedCep.length < 8) {
                form.setValue("address", "", { shouldValidate: false });
                form.setValue("city", "", { shouldValidate: false });
                form.setValue("state", "", { shouldValidate: false });
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

    const onSubmit = async (data: z.infer<typeof enterpriseFormSchema>) => {
        try {
            const result = await createEnterprise(
                data.name,
                data.specialty,
                data.phoneNumber,
                data.register,
                data.instagramURL || "",
                data.cep,
                data.address,
                data.number,
                data.complement || "",
                data.city,
                data.state,
            );

            // Se houver um arquivo de avatar, faz o upload após criar a empresa
            if (avatarFile) {
                setIsUploadingAvatar(true);
                try {
                    const formData = new FormData();
                    formData.append('photo', avatarFile);
                    await uploadEnterpriseProfilePicture(formData, result.enterpriseId);
                } catch (error) {
                    console.error("Erro ao fazer upload da imagem:", error);
                    toast.error("Erro ao fazer upload da imagem. A empresa foi criada, mas a imagem não foi salva.");
                } finally {
                    setIsUploadingAvatar(false);
                }
            }

            router.push(result.redirect);
        } catch (error) {
            if (isRedirectError(error)) {
                return
            }
            console.error("Erro ao cadastrar empresa:", error);
            toast.error("Erro ao cadastrar empresa. Por favor, tente novamente.");
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted">
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
                            <FormLabel>Foto da Empresa</FormLabel>
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
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o nome da sua empresa" {...field} />
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
                                        {enterpriseSpecialty.map((specialty) =>
                                            <SelectItem key={specialty.value} value={specialty.value}>
                                                {specialty.label}
                                            </SelectItem>
                                        )}
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
                                <FormLabel>Contato</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite a número de contato da sua empresa" {...field} />
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
                                <FormLabel>Registro (CPF ou CNPJ)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o CNPJ ou CPF do responsável pela empresa" {...field} />
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
                                        <Input placeholder="Digite o CEP" {...field} />
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                    <FormLabel>Logradouro</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Rua das Palmeiras" {...field} disabled={isCepLoading} />
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
                                        <Input placeholder="Ex: 123" {...field} id="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="complement"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Complemento <span className="text-xs text-muted-foreground">(Opcional)</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Apto 101, Bloco B" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: São Paulo" {...field} disabled={isCepLoading} />
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
                                        <Input placeholder="Ex: SP" {...field} disabled={isCepLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="instagramURL"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instagram <span className="text-xs text-muted-foreground">(Opcional)</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Cole aqui o link do Instagram da sua empresa..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting || isCepLoading}>
                            {form.formState.isSubmitting || isCepLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Cadastrar empresa")}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
}

export default EnterpriseForm;