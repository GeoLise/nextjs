"use client";

import { api } from "@/app/lib/client/api";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ImageInput } from "@/components/ui/image-input";
import { Input } from "@/components/ui/input";
import { Product } from "@/lib/shared/types/product";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pen } from "lucide-react";
import z from "zod/v4";

export function CreateUpdateProduct({ product }: { product?: Product }) {
  const schema = z.object({
    name: z.string().min(3),
    price: z.number().min(0),
    description: z.string(),
    image: z.string(),
    categoryId: z.string(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return (await api.categories.get()).data;
    },
  });

  const form = useForm({
    defaultValues: product ?? ({} as unknown as z.infer<typeof schema>),
    onSubmit: async ({ value }) => {
      if (!!product) {
        updateMutation.mutate(value);
      } else {
        createMutation.mutate(value);
      }
    },
  });

  const createMutation = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: async (data: z.infer<typeof schema>) => {
      await api.products.post(data);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["updateProduct"],
    mutationFn: async (data: z.infer<typeof schema>) => {
      await api.products({ id: product!.id }).put(data);
    },
  });

  return (
    <Dialog>
      <DialogTrigger>
        {product ? <Pen /> : <p>Создать продукт</p>}
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
                <p>Имя продукта</p>
                <Input
                  className="bg-zinc-500/30 border-zinc-800/50"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  error={field.state.meta.errors?.at(0)}
                />
              </div>
            )}
          </form.Field>
          <form.Field name="price">
            {(field) => (
              <div>
                <p>Цена продукта</p>
                <Input
                  className="bg-zinc-500/30 border-zinc-800/50"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  error={field.state.meta.errors.at(0)}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="image">
            {(field) => (
              <div>
                <p>Изображение продукта</p>
                <ImageInput
                  value={field.state.value}
                  onSaved={field.handleChange}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="categoryId">
            {(field) => (
              <div>
                <p>Категория продукта</p>
                <select
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                >
                  <option value="">Select category</option>
                  {categories?.map((cat) => (
                    <option value={cat.id} key={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </form.Field>
        </form>
      </DialogContent>
    </Dialog>
  );
}
