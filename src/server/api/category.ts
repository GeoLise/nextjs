import Elysia from "elysia";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { categories } from "../db/categories";
import { products } from "../db/products";
import z4 from "zod/v4";



export const categoriesRouter = new Elysia({
    prefix: "/categories"
})
.get("/", async () => {
    return await db.query.categories.findMany({
        where: eq(categories.isDeleted, false)
    })
})
.get("/withProducts/:id", async ({ params }) => {
    return await db.query.categories.findFirst({
        where: eq(categories.id, params.id),
        with: {
            products: {
                where: eq(products.isDeleted, false),
            }
        }
    })
})
.post("/", async ({ body }) => {
    await db.insert(categories).values({
        name: body.name
    })
}, {
    body: z4.object({
        name: z4.string()
    })
})
.put("/:id", async ({ params, body }) => {
    await db.update(categories).set({
        name: body.name
    })
    .where(eq(categories.id, params.id))
}, {
    body: z4.object({
        name: z4.string()
    })
})
.delete("/:id", async ({ params }) => {
    await db.update(categories).set({
        isDeleted: true
    })
    .where(eq(categories.id, params.id))
})