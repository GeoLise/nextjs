/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
"use client";

import { api } from "@/app/lib/client/api";
import { queryClient } from "@/app/lib/client/query-client";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import z from "zod/v4";

export default function CreateProductPage() {
  const productSchema = z.object({
    name: z
      .string({ message: "Name is required" })
      .min(3, "Name must be at least 3 characters")
      .max(30),
    price: z.number({ message: "Price is required" }).min(1).max(100000000),
    categoryId: z.string(),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return (await api.categories.get()).data;
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return (await api.products.get()).data;
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
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const form = useForm({
    defaultValues: {} as z.infer<typeof productSchema>,
    onSubmit: async (values) => {
      await createProductMutation.mutateAsync(values.value);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["deleteProduct"],
    mutationFn: async (productId: string) => {
      await api.products({ id: productId }).delete();
    },
    onSuccess: () => {
      alert("Product deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });

  return (
    <div className=" container mx-auto bg-red-300 p-4 flex flex-col gap-4">
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4 border border-yellow-800 rounded-xl p-4"
      >
        <form.Field name="name">
          {(field) => (
            <div className="flex flex-col gap-1">
              <p>Name</p>
              <input
                className="bg-green-400 placeholder:text-blue-400"
                placeholder="Type name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="price">
          {(field) => (
            <div className="flex flex-col gap-1">
              <p>Price</p>
              <input
                className="bg-green-400 placeholder:text-blue-400"
                placeholder="Type price"
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </div>
          )}
        </form.Field>
        <form.Field name="categoryId">
          {(field) => (
            <div>
              <p>Category</p>
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
        <form.Subscribe>
          {(state) => (
            <button
              type="submit"
              className="bg-amber-500 text-white p-2 rounded-xl"
            >
              Create
            </button>
          )}
        </form.Subscribe>
      </form>
      <div className="flex flex-row gap-4">
        {isLoading && <p>Loading...</p>}
        {!isLoading &&
          products?.map((prod) => (
            <div
              className="flez flex-col aspect-square items-center justify-center rounded-md bg-blue-300 p-4"
              key={prod.id}
            >
              <button
                onClick={() => deleteMutation.mutate(prod.id)}
                className="bg-red-500 text-white p-2"
              >
                Delete
              </button>
              <p>{prod.name}</p>
              <p>{prod.price}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
