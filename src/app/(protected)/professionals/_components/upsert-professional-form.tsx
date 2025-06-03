import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useState } from "react";
import Image from "next/image";

import { upsertProfessional } from "@/actions/upsert-professionals";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { professionalsTable } from "@/db/schema";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().trim().min(1, { message: "Nome do profissional é obrigatório." }),
    specialty: z.string().trim().min(1, { message: "Função ou especialidade do profissional é obrigatória." }),
    phoneNumber: z.string().trim().min(1, { message: "Telefone do profissonal é obrigatório." }),
    instagramURL: z.string().trim().url({ message: "URL do Instagram inválida." }),
    avatarImageURL: z.string().url({ message: "URL do avatar inválida." }).optional(),
    availableFromWeekDay: z.string(),
    availableToWeekDay: z.string(),
    availableFromTime: z.string().min(1, { message: "Hora de início é obrigatória" }),
    availableToTime: z.string().min(1, { message: "Hora de término é obrigatória.", }),
}).refine(
    (data) => {
        return data.availableFromTime < data.availableToTime;
    },
    {
        message:
            "O horário de início não pode ser anterior ao horário de término.",
        path: ["availableToTime"],
    },
);

interface UpsertProfessionalFormProps {
    professional?: typeof professionalsTable.$inferSelect;
    onSuccess?: () => void;
}

const UpsertProfessionalForm = ({ professional, onSuccess }: UpsertProfessionalFormProps) => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(professional?.avatarImageURL || null);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        shouldUnregister: true,
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: professional?.name || "",
            specialty: professional?.specialty || "",
            phoneNumber: professional?.phoneNumber || "",
            instagramURL: professional?.instagramURL || "",
            avatarImageURL: professional?.avatarImageURL || undefined,
            availableFromWeekDay: professional?.availableFromWeekDay?.toString() || "1",
            availableToWeekDay: professional?.availableToWeekDay?.toString() || "6",
            availableFromTime: professional?.availableFromTime || "",
            availableToTime: professional?.availableToTime || "",
        }
    })

    const upsertProfessionalAction = useAction(upsertProfessional, {
        onSuccess: () => {
            toast.success(professional ? "Profissional atualizado com sucesso!" : "Profissional adicionado com sucesso!");
            onSuccess?.();
            form.reset();
            setAvatarPreview(null);
        },
        onError: (error) => {
            console.error("Erro ao salvar profissional:", error);
            toast.error(professional ? `Erro ao atualizar profissional.` : `Erro ao adicionar profissional.`);
        },
    });

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setIsUploading(true);
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Falha no upload da imagem.");
                }

                const data = await response.json();
                form.setValue("avatarImageURL", data.url, { shouldValidate: true });
                setAvatarPreview(data.url);
            } catch (error) {
                console.error("Erro no upload:", error);
                toast.error("Erro ao fazer upload da imagem. Tente novamente.");
                setAvatarPreview(professional?.avatarImageURL || null);
                form.setValue("avatarImageURL", professional?.avatarImageURL || undefined);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        upsertProfessionalAction.execute({
            ...values,
            id: professional?.id,
            avatarImageURL: values.avatarImageURL,
            availableFromWeekDay: parseInt(values.availableFromWeekDay),
            availableToWeekDay: parseInt(values.availableToWeekDay),
        })
    };

    return (
        <DialogContent>
            <DialogTitle>{professional ? professional.name : "Adicionar profissional"}</DialogTitle>
            <DialogDescription>{professional ? "Edite as informações desse profissional." : "Adicione um novo profissional à sua empresa!"}</DialogDescription>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="avatarImageURL"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Foto do Profissional</FormLabel>
                                <FormControl>
                                    <>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="mb-2"
                                            disabled={isUploading}
                                        />
                                        {isUploading && (
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Enviando imagem...
                                            </div>
                                        )}
                                        {avatarPreview && (
                                            <div className="mt-2 relative w-32 h-32 rounded-full overflow-hidden">
                                                <Image
                                                    src={avatarPreview}
                                                    alt="Prévia do avatar"
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                />
                                            </div>
                                        )}
                                    </>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Nome do profissional
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o nome do profissonal" {...field} />
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
                                <FormLabel>
                                    Especialidade/Função
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite a função ou especialidade do profissional" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Contato
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Digite o número de telefone do profissional"{...field} />
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
                                    <Input placeholder="Cole aqui o link do Instagram do seu profissional..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="availableFromWeekDay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dia inicial de disponibilidade</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione um dia" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="0">Domingo</SelectItem>
                                        <SelectItem value="1">Segunda</SelectItem>
                                        <SelectItem value="2">Terça</SelectItem>
                                        <SelectItem value="3">Quarta</SelectItem>
                                        <SelectItem value="4">Quinta</SelectItem>
                                        <SelectItem value="5">Sexta</SelectItem>
                                        <SelectItem value="6">Sábado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="availableToWeekDay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dia final de disponibilidade</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione um dia" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="0">Domingo</SelectItem>
                                        <SelectItem value="1">Segunda</SelectItem>
                                        <SelectItem value="2">Terça</SelectItem>
                                        <SelectItem value="3">Quarta</SelectItem>
                                        <SelectItem value="4">Quinta</SelectItem>
                                        <SelectItem value="5">Sexta</SelectItem>
                                        <SelectItem value="6">Sábado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="availableFromTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Horário inicial de disponibilidade</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione um horário" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Manhã</SelectLabel>
                                            <SelectItem value="05:00:00">05:00</SelectItem>
                                            <SelectItem value="05:30:00">05:30</SelectItem>
                                            <SelectItem value="06:00:00">06:00</SelectItem>
                                            <SelectItem value="06:30:00">06:30</SelectItem>
                                            <SelectItem value="07:00:00">07:00</SelectItem>
                                            <SelectItem value="07:30:00">07:30</SelectItem>
                                            <SelectItem value="08:00:00">08:00</SelectItem>
                                            <SelectItem value="08:30:00">08:30</SelectItem>
                                            <SelectItem value="09:00:00">09:00</SelectItem>
                                            <SelectItem value="09:30:00">09:30</SelectItem>
                                            <SelectItem value="10:00:00">10:00</SelectItem>
                                            <SelectItem value="10:30:00">10:30</SelectItem>
                                            <SelectItem value="11:00:00">11:00</SelectItem>
                                            <SelectItem value="11:30:00">11:30</SelectItem>
                                            <SelectItem value="12:00:00">12:00</SelectItem>
                                            <SelectItem value="12:30:00">12:30</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Tarde</SelectLabel>
                                            <SelectItem value="13:00:00">13:00</SelectItem>
                                            <SelectItem value="13:30:00">13:30</SelectItem>
                                            <SelectItem value="14:00:00">14:00</SelectItem>
                                            <SelectItem value="14:30:00">14:30</SelectItem>
                                            <SelectItem value="15:00:00">15:00</SelectItem>
                                            <SelectItem value="15:30:00">15:30</SelectItem>
                                            <SelectItem value="16:00:00">16:00</SelectItem>
                                            <SelectItem value="16:30:00">16:30</SelectItem>
                                            <SelectItem value="17:00:00">17:00</SelectItem>
                                            <SelectItem value="17:30:00">17:30</SelectItem>
                                            <SelectItem value="18:00:00">18:00</SelectItem>
                                            <SelectItem value="18:30:00">18:30</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Noite</SelectLabel>
                                            <SelectItem value="19:00:00">19:00</SelectItem>
                                            <SelectItem value="19:30:00">19:30</SelectItem>
                                            <SelectItem value="20:00:00">20:00</SelectItem>
                                            <SelectItem value="20:30:00">20:30</SelectItem>
                                            <SelectItem value="21:00:00">21:00</SelectItem>
                                            <SelectItem value="21:30:00">21:30</SelectItem>
                                            <SelectItem value="22:00:00">22:00</SelectItem>
                                            <SelectItem value="22:30:00">22:30</SelectItem>
                                            <SelectItem value="23:00:00">23:00</SelectItem>
                                            <SelectItem value="23:30:00">23:30</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="availableToTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Horário final de disponibilidade</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecione um horário" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Manhã</SelectLabel>
                                            <SelectItem value="05:00:00">05:00</SelectItem>
                                            <SelectItem value="05:30:00">05:30</SelectItem>
                                            <SelectItem value="06:00:00">06:00</SelectItem>
                                            <SelectItem value="06:30:00">06:30</SelectItem>
                                            <SelectItem value="07:00:00">07:00</SelectItem>
                                            <SelectItem value="07:30:00">07:30</SelectItem>
                                            <SelectItem value="08:00:00">08:00</SelectItem>
                                            <SelectItem value="08:30:00">08:30</SelectItem>
                                            <SelectItem value="09:00:00">09:00</SelectItem>
                                            <SelectItem value="09:30:00">09:30</SelectItem>
                                            <SelectItem value="10:00:00">10:00</SelectItem>
                                            <SelectItem value="10:30:00">10:30</SelectItem>
                                            <SelectItem value="11:00:00">11:00</SelectItem>
                                            <SelectItem value="11:30:00">11:30</SelectItem>
                                            <SelectItem value="12:00:00">12:00</SelectItem>
                                            <SelectItem value="12:30:00">12:30</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Tarde</SelectLabel>
                                            <SelectItem value="13:00:00">13:00</SelectItem>
                                            <SelectItem value="13:30:00">13:30</SelectItem>
                                            <SelectItem value="14:00:00">14:00</SelectItem>
                                            <SelectItem value="14:30:00">14:30</SelectItem>
                                            <SelectItem value="15:00:00">15:00</SelectItem>
                                            <SelectItem value="15:30:00">15:30</SelectItem>
                                            <SelectItem value="16:00:00">16:00</SelectItem>
                                            <SelectItem value="16:30:00">16:30</SelectItem>
                                            <SelectItem value="17:00:00">17:00</SelectItem>
                                            <SelectItem value="17:30:00">17:30</SelectItem>
                                            <SelectItem value="18:00:00">18:00</SelectItem>
                                            <SelectItem value="18:30:00">18:30</SelectItem>
                                        </SelectGroup>
                                        <SelectGroup>
                                            <SelectLabel>Noite</SelectLabel>
                                            <SelectItem value="19:00:00">19:00</SelectItem>
                                            <SelectItem value="19:30:00">19:30</SelectItem>
                                            <SelectItem value="20:00:00">20:00</SelectItem>
                                            <SelectItem value="20:30:00">20:30</SelectItem>
                                            <SelectItem value="21:00:00">21:00</SelectItem>
                                            <SelectItem value="21:30:00">21:30</SelectItem>
                                            <SelectItem value="22:00:00">22:00</SelectItem>
                                            <SelectItem value="22:30:00">22:30</SelectItem>
                                            <SelectItem value="23:00:00">23:00</SelectItem>
                                            <SelectItem value="23:30:00">23:30</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit" disabled={upsertProfessionalAction.isPending || isUploading}>
                            {(upsertProfessionalAction.isPending || isUploading)
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                                : professional ? "Editar profissional"
                                    : "Cadastrar profissional"}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}

export default UpsertProfessionalForm;