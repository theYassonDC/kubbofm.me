import { useMutation } from "@tanstack/react-query";
import { sendWebhook, type LOGS_TYPE } from "~/libs/disord.service";

export const useWebhook = () => {
  return useMutation({
    mutationFn: ({ content, type }: { content: string; type: LOGS_TYPE }) =>
      sendWebhook(content, type).then((r) => r),

    onError: (error: any) => {
      console.error(
        error?.message ?? "Error al enviar webhook",
      );
    },
  });
};
