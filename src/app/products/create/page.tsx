/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: <explanation> */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
"use client";

import { api } from "@/app/lib/client/api";
import { queryClient } from "@/app/lib/client/query-client";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import z from "zod/v4";

export default function CreateProductPage() {
  const productSchema = z.object({
    name: z
      .string({ message: "Name is required" })
      .min(3, "Name must be at least 3 characters")
      .max(30),
    price: z.number({ message: "Price is required" }).min(1).max(100000000),
    categoryId: z.string(),
    image: z.string().optional(),
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
    <div className=" container mx-auto p-4 flex flex-col gap-4">
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
        <form.Field name="image">
          {(filed) => (
            <div className="bg-purple-300 w-96 p-4 rounded-xl border border-purple-600">
              <ImageInput onSuccess={filed.handleChange} />
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
              className="flez flex-col aspect-square items-center justify-center bg-zinc-400/20 border border-zinc-600 rounded-md p-4"
              key={prod.id}
            >
              <div className="relative w-20 h-20 bg-red-400">
                {prod.image && (
                  <img
                    className="object-cover w-full h-full"
                    alt="product foto"
                    width={1920}
                    height={1080}
                    src={`${window.location.origin}/api/file/${prod.image}`}
                  />
                )}
              </div>
              <p>{prod.name}</p>
              <p>{prod.price}</p>
              <button
                onClick={() => deleteMutation.mutate(prod.id)}
                className="bg-red-500 text-white p-2"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

function ImageInput({ onSuccess }: { onSuccess: (id: string) => void }) {
  const saveFileMutation = useMutation({
    mutationKey: ["saveFile"],
    mutationFn: async (image: File) => {
      const res = await api.file.post({
        file: image,
      });

      if (res.error) {
        throw new Error(res.error.value.message);
      }

      console.log(res.data);

      return res.data;
    },
    onError: (error) => {
      alert(error.message);
    },
    onSuccess: (data) => {
      alert("File saved successfully");
      onSuccess(data);
    },
  });

  return (
    <input
      type="file"
      className="cursor-pointer"
      onChange={(e) => saveFileMutation.mutate(e.target.files![0])}
    />
  );
}
