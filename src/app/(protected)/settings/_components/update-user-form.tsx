import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserName } from "@/actions/update-user-name";

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Nome é obrigatório." }),
});

interface upsertUserFormProps {
  user: { id: string; name: string };
  onSuccess?: () => void;
}

const UpdateUserForm = ({ user, onSuccess }: upsertUserFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const updateUserAction = useAction(updateUserName, {
    onSuccess: () => {
      toast.success("Dados de cadastro alterados com sucesso!");
      onSuccess?.();
      form.reset();
    },
    onError: () => {
      toast.error(`Erro ao alterar dados de cadastro.`);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateUserAction.execute({
      ...values,
      id: user.id,
    });
  };

  return (
    <DialogContent>
      <DialogTitle>{user ? user.name : "Adicionar usuário"}</DialogTitle>
      <DialogDescription>
        {user
          ? "Edite as informações desse usuário."
          : "Adicione um novo usuário à sua empresa!"}
      </DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do usuário</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome do usuário" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={updateUserAction.isPending}>
              {updateUserAction.isPending
                ? "Salvando..."
                : user
                  ? "Editar usuário"
                  : "Cadastrar usuário"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpdateUserForm;
