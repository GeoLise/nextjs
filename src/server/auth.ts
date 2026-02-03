import { getServerSession, NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users } from "./db/schema";
import bcrypt from "bcryptjs";

export const authOption: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    providers: [
        Credentials({
            name: "credentails",
            credentials: {
                email: { label : "email", type: "email", placeholder: "email"},
                password: { label: "password", type: "password", placeholder: "password"}
            },
            async authorize(credentails) {

                const user = await db.query.users.findFirst({
                    where: eq(users.email, credentails?.email ?? "")
                })

                if (!user) {
                    throw new Error("Invalid email or password")
                }

                const isPasswordCorrect = await bcrypt.compare(credentails?.password ?? "" , user.hashedPassword);

                if (!isPasswordCorrect) {
                    throw new Error("Invalid email or password")
                }
                
                return {
                    id: user.id,
                    role: user.role,
                    email: user.email,
                }
            }
        })
    ]
}

export const getAuthServerSession = () => getServerSession(authOption)