import {signIn} from "next-auth/react";


export const signinUser = async (provider: string) => {
    await signIn(provider, {callbackUrl: "/"})

}