"use client";

import { api } from "@/app/lib/client/api";
import { queryClient } from "@/app/lib/client/query-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

export function DeleteCategory({ id }: { id: string }) {
  const deleteMutation = useMutation({
    mutationKey: ["deleteCategory"],
    mutationFn: async () => {
      await api.categories({ id }).delete();
    },
    onSuccess: () => {
      alert("Категория удалена");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger>
        <Trash2 className="text-red-500" />
      </DialogTrigger>
      <DialogContent>
        <p>Вы уверены, что хотите удалить категорию?</p>
        <DialogFooter>
          <DialogClose>
            <Button>Отмена</Button>
          </DialogClose>
          <Button
            onClick={() => deleteMutation.mutate()}
            variant={"destructive"}
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
