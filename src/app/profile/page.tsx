import Image from "next/image";
import {BtnSignout} from "@/app/_components/BtnSignout";
import {getUserSession} from "@/lib/session";


export default async function Profile() {
    const user = await getUserSession()

    return (
        <div
            className={"pt-24 flex md:flex-row flex-col pl-5 pr-5 space-x-5 min-h-52 items-center justify-center overflow-hidden"}>
            <div className={"flex items-center relative  w-[400] h-[400] "}>
                <Image
                    src={user.image!}
                    alt={""}
                    style={{objectFit: "contain", borderRadius: "50px"}}
                    width={400}
                    height={400}
                />
            </div>
            <div className={"flex flex-col space-y-2 mt-4"}>
                <div className={"flex flex-row"}>
                    <p className={"font-semibold"}>Full name:</p>
                    <p className={"ml-3"}>{user.name}</p>
                </div>
                <div className={"flex flex-row"}>
                    <p className={"font-semibold"}>Email:</p>
                    <p className={"ml-3"}>{user.email}</p>
                </div>
                <BtnSignout/>

            </div>


        </div>
    )
}
