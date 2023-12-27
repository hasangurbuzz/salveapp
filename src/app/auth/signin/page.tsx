"use client"
import Image from "next/image";
import googleIcon from "../../../../public/google-xs.svg"
import authImg from "../../../../public/login-bg.png"
import useWindowDimensions from "@/lib/hooks/useWindow";
import {signinUser} from "@/lib/auth/authUtil";
import {useRouter} from "next/navigation";

export default function Signin() {
    const {width} = useWindowDimensions()
    const router = useRouter()

    const handleGoogle = async () => {
        try {
            await signinUser("google")

        } catch (e) {
            router.push("/auth/signin")
            console.log("Error occurred try again")
        }
    }

    return (
        <div className={"flex flex-row justify-center items-center"}>
            {width! > 568 &&
                <div className={"w-1/2 relative h-screen"}>
                    <Image
                        src={authImg}
                        alt={""}
                        objectFit={"cover"}
                        fill/>

                </div>}
            <div className={"w-1/2 flex flex-col h-screen justify-around items-center"}>
                <p className={"text-lg text-center"}>Choose an option to sign in</p>
                <button className={"flex shadow-md p-2 hover:shadow-lg hover:shadow-gray-600"}
                        onClick={() => handleGoogle()}>
                    <Image src={googleIcon} alt={"Google"}/>
                    <p className={"pl-2"}>Sign in with Google</p>
                </button>

            </div>
        </div>

    )
}

