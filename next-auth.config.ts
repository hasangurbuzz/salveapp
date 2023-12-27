import {NextAuthOptions} from "next-auth";
import Google from "next-auth/providers/google";
import {session} from "@/lib/session";
import {createUser, findUserById} from "@/lib/firebase/firestore";
import {getFileUrl, getProfileImage, uploadProfileImage} from "@/lib/firebase/storage";
import {User} from "@/lib/types/User";

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
        )
    ],
    callbacks: {
        signIn: async function ({profile, user}) {
            if (!user.email) {
                throw new Error("not found")
            }

            const existingUser = await findUserById(user.id)
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
            return token
        },
        async redirect({url, baseUrl}) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        }

    },

    pages: {
        signIn: "/auth/signin"
    }
}