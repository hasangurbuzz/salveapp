import HeaderBtn from "@/app/_components/HeaderBtn";
import Link from "next/link";
import {getUserSession} from "@/lib/session";
import UserContext from "@/app/_components/UserContext";
import NotificationPopover from "@/app/_components/NotificationPopover";
import React from "react";

export default async function Header() {
    const user = await getUserSession()


    return (
        <div className={"flex items-center justify-around h-14 bg-white z-10 fixed left-0 right-0 shadow-md"}>
            {user && <UserContext user={user}/>}
            <div className={"lg:ml-10 ml-2 fixed left-0"}>
                <Link className={"text-2xl font-semibold"} href={"/"}>
                    Salve
                </Link>


            </div>

            {user &&

                <>
                    <div className={"fixed right-0 lg:mr-10 mr-2 flex "}>
                        <NotificationPopover userId={user.id}/>

                        <HeaderBtn content={user.name!} className={""} redirectPath={"/profile"}/>
                    </div>
                </>


            }

            {!user &&

                <div className={"fixed right-0 lg:mr-10 mr-2"}>
                    <HeaderBtn
                        content={"Sign in"}
                        className={"header-login-button"}
                        redirectPath={"/auth/signin"}
                    />

                </div>
            }
        </div>
    )
}