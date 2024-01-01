import {signIn} from "next-auth/react";


export const signinUser = async (name: string, email: string) => {
    await signIn("credentials", {
        name: name,
        email: email
    })
}

export const signinGoogle = async () => {
    await signIn("google", {callbackUrl: "/"})

}