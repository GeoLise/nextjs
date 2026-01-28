/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
"use client";

import { api } from "@/app/lib/client/api";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod/v4";

const productSchema = z.object({
  name: z.string({ message: "Name is required" }).min(3).max(50),
  price: z.number({ message: "Price is required" }).min(1).max(100000),
  categoryId: z.string({ message: "Category is required" }),
});

export default function CreateProductPage() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return (await api.categories.get()).data;
    },
  });

  const createProductMutation = useMutation({
    mutationKey: ["createProduct"],
    mutationFn: async (data: z.infer<typeof productSchema>) => {
      const res = await api.products.post(data);

      if (res.error) {
        throw new Error(res.error.value.message);
      }
    },
    onSuccess: () => {
      alert("Product created successfully");
    },
    onError: (error) => {
      alert(error);
    },
  });

  const form = useForm({
    defaultValues: {} as z.infer<typeof productSchema>,
    onSubmit: async ({ value }) => {
      createProductMutation.mutate(value);
    },
  });

  return (
    <div className="flex flex-col gap-20">
      <p>Create product</p>
      <form
        className="flex flex-col gap-6 p-2 bg-green-300"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <form.Field name="name">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label>Name</label>
              <input
                className="bg-red-200 text-black p-2 h-10 w-40"
                placeholder="Ttpe name"
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="price">
          {(field) => (
            <div className="flex flex-col gap-1">
              <label>Price</label>
              <input
                className="bg-red-200 text-black p-2 h-10 w-40"
                placeholder="Ttpe price"
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="categoryId">
          {(field) => (
            <div className="flex flex-col gap-1">
              {" "}
              <label>Категория</label>{" "}
              <select
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                className="p-2 w-40 bg-white placeholder:text-zinc-400 text-black"
              >
                <option value="">Выберите категорию</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>
        <form.Subscribe>
          {(state) => (
            <button
              type="submit"
              onClick={() => form.handleSubmit()}
              className="text-blue-400 bg-red-400 rounded-2xl w-fit p-2"
            >
              Create product
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
