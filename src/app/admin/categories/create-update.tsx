"use client";

import { api } from "@/app/lib/client/api";
import { queryClient } from "@/app/lib/client/query-client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Category } from "@/lib/shared/types/category";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Pen } from "lucide-react";
import { useState } from "react";
import { z } from "zod/v4";

export function CreateUpdateCategory({ category }: { category?: Category }) {
  const [isOpen, setIsOpen] = useState(false);

  const categoySchema = z.object({
    name: z
      .string({ message: "Необходимо ввести имя" })
      .min(3, { message: "3 надо" }),
  });

  const createCategoryMutation = useMutation({
    mutationKey: ["createCategory"],
    mutationFn: async (data: z.infer<typeof categoySchema>) => {
      await api.categories.post(data);
    },
    onSuccess: () => {
      alert("Создана категория");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      form.reset();
      setIsOpen(false);
    },
    onError: () => {
      alert("Ошибка создания категории");
    },
  });

  const updateCategoryMutation = useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: async (data: z.infer<typeof categoySchema>) => {
      await api.categories({ id: category!.id }).put(data);
    },
    onSuccess: () => {
      alert("Обновлена категория");
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      form.reset();
      setIsOpen(false);
    },
    onError: () => {
      alert("Ошибка обновления категории");
    },
  });

  const form = useForm({
    defaultValues: {
      ...category,
    } as z.infer<typeof categoySchema>,
    onSubmit: async ({ value }) => {
      if (!!category) {
        updateCategoryMutation.mutate(value);
      } else {
        createCategoryMutation.mutate(value);
      }
    },
    validators: {
      onSubmit: categoySchema,
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        {category ? <Pen /> : <Button>Создать</Button>}
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(e);
          }}
          className="flex flex-col gap-8"
        >
          <form.Field name="name">
            {(field) => (
              <div>
                <p>Имя категории</p>
                <Input
                  className="bg-zinc-500/30 border-zinc-800/50"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={field.state.meta.errors?.at(0)?.message}
                />
              </div>
            )}
          </form.Field>
          <form.Subscribe>
            {(state) => (
              <Button type="submit" disabled={!state.canSubmit}>
                Сохранить
              </Button>
            )}
          </form.Subscribe>
        </form>
      </DialogContent>
    </Dialog>
  );
}
