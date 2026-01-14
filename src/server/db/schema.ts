import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";
export * from "./categories";
export * from "./products";

export const commonFileds = {
    id: pg.varchar("id", { length: 255}).notNull().primaryKey().$defaultFn(() => Bun.randomUUIDv7()),
    isDeleted: pg.boolean("is_deleted").default(false),
    createdAt: pg.timestamp("creacted_at").defaultNow()
}





