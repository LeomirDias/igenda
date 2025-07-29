"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SquareArrowOutUpRight, User } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateUserName } from "@/actions/update-user-name";
import { schema } from "@/actions/update-user-name/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import EditUserNameDialog from "./edit-user-name-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { deleteUser } from "@/actions/delete-user";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
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
    onError: () => {
      toast.error("Erro ao atualizar nome. Tente novamente.");
    },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    executeUpdateUserName(values);
  };

  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { execute: executeDeleteUser } = useAction(deleteUser, {
    onSuccess: () => {
      toast.success("Conta excluída com sucesso!");
      window.location.href = "/authentication";
    },
    onError: (error) => {
      toast.error(
        "Não é possível excluir a conta com uma assinatura ativa. Cancele sua assinatura antes.",
      );
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    await executeDeleteUser();
    setIsDeleting(false);
    setConfirmText("");
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="text-primary h-5 w-5" />
          <CardTitle className="flex items-center gap-2">
            Dados de cadastro
            <span>
              <EditUserNameDialog user={{ id: user.id, name: user.name }} />
            </span>
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          <p className="text-md">
            <span className="font-semibold">Nome: </span> {user.name}
          </p>
          <p className="text-md">
            <span className="font-semibold">Email: </span>
            {user.email}
          </p>
        </div>
      </CardContent>
      
      <a href="/subscription">
        <Badge className="bg-card border-border text-primary hover:bg-primary absolute top-3 right-3 cursor-pointer p-2 hover:text-white">
          {user.plan ? "Assinatura ativa" : "Sem assinatura"}{" "}
          <SquareArrowOutUpRight />
        </Badge>
      </a>

      <div className="flex flex-col gap-2 p-4 pt-0">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="mt-2 w-full">
              Excluir conta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir conta</DialogTitle>
              <DialogDescription>
                Esta ação é{" "}
                <span className="text-destructive font-bold">permanente</span> e
                irá excluir{" "}
                <span className="font-bold">
                  todas as informações da sua conta e da empresa criada
                </span>
                . Para confirmar, digite{" "}
                <span className="font-mono font-bold">EXCLUIR</span> no campo
                abaixo.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Digite EXCLUIR para confirmar"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-2"
              autoFocus
            />
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmText !== "EXCLUIR" || isDeleting}
                className="w-full"
              >
                {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

export default UserCard;
