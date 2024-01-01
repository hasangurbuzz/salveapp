import {NextAuthOptions} from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import {session} from "@/lib/session";
import {getFileUrl, getProfileImage, uploadProfileImage} from "@/lib/firebase/storage";
import {User} from "@/lib/types/User";
import {createUser, findUserByEmail, findUserById} from "@/lib/firebase/firestore/userService";
import {generateRandomId} from "@/lib/util";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        Google(
            {
                clientId: GOOGLE_CLIENT_ID,
                clientSecret: GOOGLE_CLIENT_SECRET
            }
        ),
        Credentials(
            {
                type:"credentials",
                name:"credentials",
                credentials:{
                    name: {type: "text"},
                    email: {type: "text"}
                },
                authorize: async (credentials) => {
                    const imageUrl = await getFileUrl("images", "default_profile.png")

                    const user : User = {
                        id: generateRandomId(),
                        name: credentials!.name,
                        email: credentials!.email,
                        image: imageUrl
                    }

                    await createUser(user)

                    return user

                }
            }
        )
    ],
    callbacks: {
        signIn: async function ({profile, user}) {
            if (!user.email) {
                throw new Error("not found")
            }

            const existingUser = await findUserByEmail(user.email)
            if (existingUser) {
                return true
            }

            let imageUrl: string
            if (user.image) {
                const response = await fetch(user.image)
                const buffer = await response.arrayBuffer()
                await uploadProfileImage(user.id, buffer)
                imageUrl = await getProfileImage(user.id)

            } else {
                imageUrl = await getFileUrl("images", "default_profile.png")
            }

            user = {
                id: user.id,
                image: imageUrl,
                email: user.email,
                name: user.name!
            }


            await createUser(user as User)
            return true
        },
        session,
        async jwt({token, user, account, profile, trigger, session}) {
            if (trigger === "update") {
                return {...token, ...session.user};
            }
            if (profile) {
                token.user = await findUserById(user.id)
            }
            if (user){
                token.user = user
            }
            return token
        },
        async redirect({url, baseUrl}) {
            return baseUrl
        }

    },

    pages: {
        signIn: "/auth/signin"
    }
}