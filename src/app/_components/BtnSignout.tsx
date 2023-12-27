"use client"
import {signOut} from "next-auth/react";

export const BtnSignout = () => {


    return (
        <button className={"bg-red-500 p-2 text-white font-semibold rounded hover:bg-red-600"}
                onClick={() =>
                    signOut()}>
            Sign out

        </button>
    )
}