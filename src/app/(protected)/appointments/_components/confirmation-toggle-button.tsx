"use client";

import { useState } from "react";
import { Hand, MonitorCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

import { updateEnterprise } from "@/actions/update-enterprise-appointment-confirmation";

interface ConfirmationToggleButtonProps {
  enterpriseId: string;
  currentConfirmation: "manual" | "automatic";
}

export function ConfirmationToggleButton({
  enterpriseId,
  currentConfirmation,
}: ConfirmationToggleButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<"manual" | "automatic">(
    currentConfirmation,
  );

  const { execute } = useAction(updateEnterprise, {
    onSuccess: () => {
      toast.success(
        `Confirmação de agendamentos alterada para: ${
          confirmation === "automatic" ? "automática" : "manual"
        }`,
      );
    },
    onError: (error) => {
      toast.error("Erro ao alterar confirmação");
      console.error(error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleToggle = () => {
    setIsLoading(true);
    const newConfirmation = confirmation === "manual" ? "automatic" : "manual";
    setConfirmation(newConfirmation);

    execute({
      id: enterpriseId,
      confirmation: newConfirmation,
    });
  };

  const isAutomatic = confirmation === "automatic";

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      className="text-primary hover:bg-primary hover:border-primary flex cursor-pointer items-center border-white bg-white text-xs hover:text-white sm:text-sm"
    >
      {isLoading ? (
        <span className="mr-2 flex h-4 w-4 items-center justify-center">
          <svg
            className="text-primary animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 16 16"
          >
            <circle
              className="opacity-25"
              cx="8"
              cy="8"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M15 8a7 7 0 11-7-7v2a5 5 0 100 10V8a7 7 0 017-7z"
            />
          </svg>
        </span>
      ) : isAutomatic ? (
        <MonitorCheck />
      ) : (
        <Hand />
      )}
      <span className="hidden lg:inline">
        {isAutomatic ? "Confirmação: Automática" : "Confirmação: Manual"}
      </span>
    </Button>
  );
}
