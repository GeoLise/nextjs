import Elysia from "elysia";
import { productsRouter } from "./products";
import { categoriesRouter } from "./category";
import { treaty } from "@elysiajs/eden";
import { userRouter } from "./user";


export const app = new Elysia({
    prefix: "/api"
})
.use(productsRouter)
.use(categoriesRouter)
.use(userRouter)


export const api = treaty(app).api


export type App = typeof app