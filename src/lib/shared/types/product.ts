import { api } from "@/server/api";

export type Product = NonNullable<
  Awaited<ReturnType<typeof api.products.get>>["data"]
>[number];
