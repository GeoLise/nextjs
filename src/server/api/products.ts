import Elysia from "elysia";
import { db } from "../db";
import { and, eq } from "drizzle-orm";
import { products } from "../db/products";
import z from "zod/v4";



export const productsRouter = new Elysia({
    prefix: "/products"
})
.get("/", async () => {
    return await db.query.products.findMany({
        where: eq(products.isDeleted, false)
    })
})
.get("/:id", async ({ params }) => {
    return await db.query.products.findFirst({
        where: eq(products.id, params.id)
    })
})
.post("/", async ({ body }) => {
    await db.insert(products).values({
        name: body.name,
        price: body.price,
        categoryId: body.categoryId
    })
}, {
    body: z.object({
        name: z.string(),
        price: z.number(),
        categoryId: z.string()
    })
})
.put("/:id", async ({ params, body}) => {
    await db.update(products).set({
        name: body.name,
        price: body.price,
        categoryId: body.categoryId
    })
    .where(eq(products.id, params.id))
}, {
    body: z.object({
        name: z.string(),
        price: z.number(),
        categoryId: z.string()
    })
})
.delete("/:id", async ({ params }) => {
    await db.update(products).set({
        isDeleted: true
    })
    .where(eq(products.id, params.id))
})
.get("/byCategory/:id", async ({ params }) => {
    return await db.query.products.findMany({
        where: and(eq(products.categoryId, params.id), eq(products.isDeleted, false))
    })
})
