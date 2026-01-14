import * as pg from "drizzle-orm/pg-core";
import { commonFileds } from "./schema";
import { relations } from "drizzle-orm";
import { categories } from "./categories";

export const products = pg.pgTable("products", {
    ...commonFileds,
    name: pg.varchar("name", { length: 255}).notNull(),
    price: pg.integer("price").notNull(),
    categoryId: pg.varchar("category_id", {length: 255}).notNull().references(() => categories.id),
})

export const productsRelations = relations(products, ({ one }) => ({
    category: one(categories, ({
        fields: [products.categoryId],
        references: [categories.id]
    
    }))
}))