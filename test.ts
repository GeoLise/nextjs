import { db } from "@/server/db";
import { categories, products } from "@/server/db/schema";
import { eq } from "drizzle-orm";



async function getProducts() {
    return await db.query.products.findMany()
}

async function createCategory(name: string) {
    await db.insert(categories).values({
        name: name
    })
}

async function getCategories() {
    return await db.query.categories.findMany({
        where: eq(categories.isDeleted, false)
    })
} 

//019bd5b6-cc0e-7000-b0a7-8db04ba5ef51


async function createProduct(name: string, price: number, categoryId: string) {
    await db.insert(products).values({
        name: name,
        price: price,
        categoryId: categoryId
    })
}

async function getProductsWithCategory() {
    return await db.query.products.findMany({
        with: {
            category: true
        }
    })
}


async function deleteCategory(id: string) {
    await db.update(categories).set({
        isDeleted: true
    })
    .where(eq(categories.id, id))
}


async function updateProduct(id: string, name: string, price: number, categoryId: string) {
    await db.update(products).set({
        name: name,
        price: price,
        categoryId: categoryId
    })
    .where(eq(products.id, id))
}


await deleteCategory("019bd5b6-cc0e-7000-b0a7-8db04ba5ef51")