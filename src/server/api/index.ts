import Elysia from "elysia";
import { productsRouter } from "./products";
import { categoriesRouter } from "./category";


export const app = new Elysia({
    prefix: "/api"
})
.use(productsRouter)
.use(categoriesRouter)