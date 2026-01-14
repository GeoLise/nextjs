import { db } from "@/server/db";
import { categories, products } from "@/server/db/schema";
import { eq } from "drizzle-orm";

async function getProducts() {
    return await db.select().from(products).where(eq(products.isDeleted, false))
}


async function createProduct(name: string, price: number) {
    await db.insert(products).values({
        name: name,
        price: price,
        categoryId: "019bbc61-d70b-7000-b219-4971249e0153"
    })
}

async function deleteProducts(id: string) {
    await db.update(products).set({
        isDeleted: true
    }).where(eq(products.id, id))
}


async function createCategory(name: string) {
    await db.insert(categories).values({
        name: name
    })
}

async function updateProduct(id: string, name: string, price: number) {
    await db.update(products).set({
        name: name,
        price: price,
    })
}


console.log(await getProducts())

await deleteProducts("019bbc63-afa7-7000-9b1d-ee2d1cd70501")

console.log(await getProducts())


