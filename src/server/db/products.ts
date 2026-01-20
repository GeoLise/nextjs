import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const products = pg.pgTable("products", {
        id: pg.varchar("id", {length: 255}).notNull().primaryKey().$defaultFn(() => Bun.randomUUIDv7()),
    isDeleted: pg.boolean("is_deleted").notNull().default(false),
    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
    name: pg.varchar("name", {length: 255}).notNull(),
    price: pg.integer("price").notNull(),
    categoryId: pg.varchar("category_id").notNull().references(() => categories.id),
})

export const productsRelations = relations(products, ({ one }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id]
    })
}))