"use client";

import { api } from "@/app/lib/client/api";
import { DataTable } from "@/components/ui/data-table";
import { Product } from "@/lib/shared/types/product";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { CreateUpdateProduct } from "./create-update";

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "price",
    header: "Цена",
  },
  {
    id: "actions",
    header: () => <CreateUpdateProduct />,
    cell: ({ row }) => <CreateUpdateProduct product={row.original} />,
  },
];

export function ProductsTable({ initialData }: { initialData: Product[] }) {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      return (await api.products.get()).data;
    },
    initialData,
  });

  return <DataTable columns={columns} data={products ?? []} />;
}
