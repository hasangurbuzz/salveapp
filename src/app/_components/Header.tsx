import HeaderBtn from "@/app/_components/HeaderBtn";
import Link from "next/link";
import {getUserSession} from "@/lib/session";
import UserContext from "@/app/_components/UserContext";
import NotificationPopover from "@/app/_components/NotificationPopover";
import React from "react";
import HeaderProfileBtn from "@/app/_components/HeaderProfileBtn";
import {User} from "@/lib/types/User";
import ChatPopover from "@/app/_components/ChatPopover";

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

                        <ChatPopover user={user as User}/>

                        <NotificationPopover userId={user.id}/>

                        <div className={"sm:flex hidden"}>
                            <HeaderBtn content={user.name!} className={""} redirectPath={"/profile"}/>
                        </div>

                        <div

                            className={"sm:hidden flex"}>
                            <HeaderProfileBtn user={user as User}/>
                        </div>

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