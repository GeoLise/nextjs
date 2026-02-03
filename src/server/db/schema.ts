import { relations } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";


export * from "./categories";
export * from "./products";

export const roleEnum = pg.pgEnum("roles", ["USER", "ADMIN"])

export const users = pg.pgTable("users", {
    id: pg.varchar("id", {length: 255}).notNull().primaryKey().$defaultFn(() => Bun.randomUUIDv7()),
    isDeleted: pg.boolean("is_deleted").notNull().default(false),
    createdAt: pg.timestamp("created_at").notNull().defaultNow(),
    email: pg.varchar("email", {length: 255}).notNull().unique(),
    hashedPassword: pg.varchar("hashed_password", {length: 255}).notNull(),
    role: roleEnum("role").notNull().default("USER")
})