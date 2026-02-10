import Elysia from "elysia";
import { productsRouter } from "./products";
import { categoriesRouter } from "./category";
import { treaty } from "@elysiajs/eden";
import { userRouter } from "./user";
import { fileRouter } from "./file";


export const app = new Elysia({
    prefix: "/api"
})
.use(productsRouter)
.use(categoriesRouter)
.use(userRouter)
.use(fileRouter)


export const api = treaty(app).api


export type App = typeof app