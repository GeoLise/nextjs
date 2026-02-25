"use client";

import { DataTable } from "@/components/ui/data-table";
import { Category } from "@/lib/shared/types/category";
import { ColumnDef } from "@tanstack/react-table";
import { CreateUpdateCategory } from "./create-update";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/app/lib/client/api";
import { DeleteCategory } from "./delete";

const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Имя категории",
    cell: ({ row }) => <p>{row.original.name}</p>,
  },
  {
    id: "actions",
    header: () => <CreateUpdateCategory />,
    cell: ({ row }) => (
      <div className="flex flex-row gap-4">
        <CreateUpdateCategory category={row.original} />
        <DeleteCategory id={row.original.id} />
      </div>
    ),
  },
];

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const { data: initialData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return (await api.categories.get()).data;
    },
    initialData: categories,
  });

  return (
    <div className="p-10">
      <DataTable columns={columns} data={initialData ?? []} />
    </div>
  );
}
