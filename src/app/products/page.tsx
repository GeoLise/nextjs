"use client";

import { api } from "@/lib/client/api";
import { queryClient } from "@/lib/client/query-client";
import { useQuery } from "@tanstack/react-query";

export default function Products() {
  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return (await api.products.get()).data;
    },
  });

  const refetchProducts = () => {
    queryClient.invalidateQueries({
      queryKey: ["products"],
    });
  };

  return (
    <div className="bg-foreground flex md:flex-row flex-col md:text-white text-green-400 md:text-9xl text-xl md:gap-10 gap-4">
      <p>Products</p>
      <p>catalog</p>
      <div className="text-xl text-red-400">
        {isProductsLoading
          ? "Loading..."
          : products?.map((products) => (
              <p key={products.id}>{products.name}</p>
            ))}
        <button
          className="text-blue-500 bg-green-300 p-2 "
          onClick={refetchProducts}
        >
          Refresh products
        </button>
      </div>
    </div>
  );
}
