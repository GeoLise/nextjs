import * as pg from "drizzle-orm/pg-core";
import { commonFileds } from "./schema";
import { relations } from "drizzle-orm";
import { products } from "./products";

export const categories = pg.pgTable("categories", {
    ...commonFileds,
    name: pg.varchar("name", { length: 255}).notNull(),
})



export const categoriesRelations = relations(categories, ({ many }) => ({
    products: many(products)
}))