"use client";

import { api } from "@/app/lib/client/api";
import { queryClient } from "@/app/lib/client/query-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteProduct({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const deleteMutation = useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: async () => {
      await api.products({ id }).delete();
    },
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Продукт удален");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Trash2 className="text-red-500" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Удалить продукт</DialogTitle>
        </DialogHeader>
        <p>Вы уверены, что хотите удалить продукт?</p>
        <DialogFooter>
          <DialogClose>
            <Button>Отмена</Button>
          </DialogClose>
          <Button onClick={() => deleteMutation.mutate()}>Удалить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
