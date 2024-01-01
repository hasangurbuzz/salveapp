import {BtnSignout} from "@/app/_components/BtnSignout";
import {getUserSession} from "@/lib/session";
import RoundedImage from "@/app/_components/RoundedImage";


export default async function Profile() {
    const user = await getUserSession()

    return (
        <div
            className={"pt-24 flex md:flex-row flex-col pl-5 pr-5 space-x-5 min-h-svh items-center justify-center"}>
            <div className={"sm:w-[200px] w-[100px]"}>
                <RoundedImage imageUrl={user.image} alt={""}/>
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
