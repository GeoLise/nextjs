import { api } from "@/server/api";
import { ProductsTable } from "./products-table";

export default async function AdminProducts() {
  const products = (await api.products.get()).data;

  return <ProductsTable initialData={products ?? []} />;
}
