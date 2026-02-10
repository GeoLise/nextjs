import Elysia from "elysia";
import z from "zod/v4";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../db/schema";
import bcrypt from "bcryptjs";
import { getAuthServerSession } from "../auth";

export const userService = new Elysia({ name: "user/service"})
.derive(
    { as: "global" },
    async () => await {
        session: await getAuthServerSession()
    }
)
.macro({
    isSignedIn: (enabled?: boolean) => {

        if (!enabled) return;

        return {
            beforeHandle({ session, set }) {
                if (!session) {

                    set.status = 401;

                    return Response.json({
                        code: 401,
                        message: "Вы не авторизованы"
                    })
                }
            }
        }
    },
    hasRole: (role: "ADMIN" | "USER") => {
        if (role === "USER") return;

        return {
            beforeHandle({ session, set }) {

                if (!session) {
                    set.status = 401;
                    return Response.json({
                        code: 401,
                        message: "Вы не авторизованы"
                    })
                }

                if (session?.user.role !== role) {
                    set.status = 403;

                    return Response.json({
                        code: 403,
                        mesaage: "Вы не можете выполнить это действие"
                    })
                }
            }
        }
    }
})


export const userRouter = new Elysia({
    prefix: "/user",
})
.use(userService)
.post("/signup", async ({ body, set }) => {
    const exitedUser = await db.query.users.findFirst({
        where: eq(users.email, body.email)
    })

    if (exitedUser) {
        set.status = 400
        return Response.json({
            code: 400,
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    await db.insert(users).values({
        hashedPassword: hashedPassword,
        email: body.email,
        role: body.email === process.env.MAIN_ADMIN_EMAIL ? "ADMIN" : "USER"

    })

}, {
    body: z.object({
        email: z.email(),
        password: z.string()
    })
})
.get("/session", async ({ session }) => {
    return session;
}, {
    isSignedIn: true
})


