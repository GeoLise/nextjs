import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
import { products } from "./products";

export const categories = pg.pgTable("categories", {
        id: pg.varchar("id", {length: 255}).notNull().primaryKey().$defaultFn(() => Bun.randomUUIDv7()),
    isDeleted: pg.boolean("is_deleted").notNull().default(false),
    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
    name: pg.varchar("name", {length: 255}).notNull(),
})


export const categoriesRelations = relations(categories, ({ many}) => ({
    products: many(products)
}))