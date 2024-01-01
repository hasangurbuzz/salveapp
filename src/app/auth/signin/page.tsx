"use client"
import Image from "next/image";
import googleIcon from "../../../../public/google-xs.svg"
import authImg from "../../../../public/login-bg.png"
import {signinGoogle, signinUser} from "@/lib/auth/authUtil";
import {useRouter} from "next/navigation";
import TextInput from "@/app/_components/TextInput";
import {InputType} from "@/lib/types/InputType";
import {useState} from "react";
import {isEmailValid} from "@/lib/util";

type State = {
    email: string,
    password: string,
    name: string
}

type ValidState = {
    isEmailValid: boolean,
    isNameValid: boolean,
    isPasswordValid: boolean
}

export default function Signin() {
    const router = useRouter()
    const [state, setState] = useState<State>({
        email: "",
        password: "",
        name: ""
    })

    const [validState, setValidState] = useState<ValidState>({
        isEmailValid: false,
        isNameValid: false,
        isPasswordValid: false
    })

    const inputsValid = validState.isPasswordValid && validState.isEmailValid && validState.isNameValid


    const handleGoogleLogin = async () => {
        try {
            await signinGoogle()

        } catch (e) {
            router.push("/auth/signin")
        }
    }

    const handleEmailLogin = async () => {
        if (inputsValid) {
            await signinUser(
                state.name,
                state.email
            )
        }
    }

    const handleInputChange = (value: string, name: string) => {
        setState(prev => ({
            ...prev,
            [name]: value
        }))
        if (name === "email") {
            setValidState(prev => ({
                ...prev,
                isEmailValid: isEmailValid(value)
            }))
        } else if (name === "name") {
            setValidState(prev => ({
                ...prev,
                isNameValid: value.length > 2
            }))
        } else {
            setValidState(prev => ({
                ...prev,
                isPasswordValid: value.length > 2
            }))
        }

        console.log(validState)
    }


    return (
        <div className={"flex flex-row justify-center items-center bg-white"}>
            <div className={"w-1/2 relative h-screen hidden sm:block"}>
                <Image
                    src={authImg}
                    alt={""}
                    objectFit={"cover"}
                    fill/>

            </div>
            <div className={"sm:w-1/2 w-full flex flex-col h-screen justify-around items-center"}>
                <p className={"text-lg text-center"}>Choose an option to sign in</p>
                <div className={"w-[80%] flex-col flex items-center"}>
                    <label className={"w-full"}>Full name*</label>
                    <TextInput
                        name={"name"}
                        onChange={handleInputChange}
                        value={state.name}
                        placeholder={"Enter full name"}
                        type={InputType.TEXT}/>

                    <label className={"w-full"}>Email*</label>
                    <TextInput
                        name={"email"}
                        onChange={handleInputChange}
                        value={state.email}
                        placeholder={"Enter e-mail"}
                        type={InputType.TEXT}/>

                    <label className={"w-full"}>Password*</label>
                    <TextInput
                        name={"password"}
                        onChange={handleInputChange}
                        value={state.password}
                        placeholder={"Enter e-mail"}
                        type={InputType.PASSWORD}/>

                    <button
                        onClick={handleEmailLogin}
                        className={`${inputsValid ? 'bg-blue-600 text-white' : 'bg-gray-300'} p-2 mt-2 rounded shadow-md hover:shadow-lg shadow-gray-500`}>
                        Sign in
                    </button>

                </div>
                <button className={"flex shadow-md p-2 hover:shadow-lg hover:shadow-gray-600"}
                        onClick={() => handleGoogleLogin()}>
                    <Image src={googleIcon} alt={"Google"}/>
                    <p className={"pl-2"}>Sign in with Google</p>
                </button>

            </div>
        </div>

    )
}

