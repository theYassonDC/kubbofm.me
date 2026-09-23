import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNew, type NewDto } from "~/libs/radio.service";

export const useCreateNew = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ token, body }: { token: string; body: NewDto }) =>
      createNew(token, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["news"],
      });
    },

    onError: (error: any) => {
      console.error(
        error.response?.data?.message ?? "Error al registrar noticia",
      );
    },
  });
};
