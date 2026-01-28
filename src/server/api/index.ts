import Elysia from "elysia";
import { productsRouter } from "./products";
import { categoriesRouter } from "./category";
import { treaty } from "@elysiajs/eden";


export const app = new Elysia({
    prefix: "/api"
})
.use(productsRouter)
.use(categoriesRouter)


export const api = treaty(app).api


export type App = typeof app