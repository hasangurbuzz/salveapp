import {getUserSession} from "@/lib/session";
import {redirect} from "next/navigation";
import ProfilePostsSection from "@/app/_components/sections/ProfilePostsSection";
import ModifyFriendship from "@/app/_components/ModifyFriendship";
import {User} from "@/lib/types/User";
import {findUserById} from "@/lib/firebase/firestore/userService";
import RoundedImage from "@/app/_components/RoundedImage";

type Params = {
    params: {
        id: string
    }
}

export default async function Profile({params}: Params) {
    const currentUser = await getUserSession()
    const {id} = params
    if (currentUser.id === id) {
        redirect("/profile")
    }

    const user = await findUserById(id)
    if (!user) {
        redirect("/")
    }

    return (
        <div className={"flex flex-col items-center bg-gray-200 space-y-2 "}>
            <div
                className={" w-full flex flex-col sm:grid sm:grid-cols-2 min-h-[300px] pt-16 bg-gray-200 space-x-5 justify-center items-center"}>
                <div className={"col-span-1 items-center flex justify-end "}>
                    <div className={"relative w-[100px] h-[100px] sm:w-[200px] sm:h-[200px]"}>
                        <RoundedImage imageUrl={user.image} alt={""}/>
                    </div>
                </div>
                <div className={"col-span-1 space-y-2 flex justify-start flex-col "}>
                    <div className={"flex space-x-2"}>
                        <p className={"font-semibold"}>Full name: </p>
                        <p>{user.name}</p>
                    </div>

                </div>
            </div>
            <ModifyFriendship currentUser={currentUser as User} user={user}/>
            <ProfilePostsSection user={user}/>
        </div>
    )


}