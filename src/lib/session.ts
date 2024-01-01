"use server"
import {getServerSession} from 'next-auth'
import {User as UserType} from "@/lib/types/User";

export const session = async ({session, token}: any) => {
    session.user = token.user
    return session
}

export const getUserSession = async (): Promise<UserType> => {
    const authUserSession = await getServerSession({
        callbacks: {
            session,
        },
    })

    return authUserSession?.user as UserType
}

