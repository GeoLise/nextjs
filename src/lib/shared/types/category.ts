import { api } from "@/server/api";
import { InferTreatyReturnType } from "./utils";

export type Category = InferTreatyReturnType<typeof api.categories.get>[number];
