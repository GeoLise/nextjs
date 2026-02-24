"use client";

import { DataTable } from "@/components/ui/data-table";
import { Category } from "@/lib/shared/types/category";
import { ColumnDef } from "@tanstack/react-table";
import { CreateUpdateCategories, CreateUpdateCategory } from "./create-update";

export function CategoriesTable({ categories }: { categories: Category[] }) {
  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Имя категории",
      cell: ({ row }) => <p>{row.original.name}</p>,
    },
    {
      id: "actions",
      header: () => <CreateUpdateCategory />,
      cell: ({ row }) => <CreateUpdateCategory category={row.original} />,
    },
  ];

  return (
    <div className="p-10">
      <DataTable columns={columns} data={categories} />
    </div>
  );
}
