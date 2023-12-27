import {getUserSession} from "@/lib/session";
import {redirect} from "next/navigation";
import {findUserById} from "@/lib/firebase/firestore";
import Image from "next/image";
import ProfilePostsSection from "@/app/_components/ProfilePostsSection";
import ModifyFriendship from "@/app/_components/ModifyFriendship";
import {User} from "@/lib/types/User";

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
                className={" w-full grid grid-cols-2 min-h-[300px] pt-16 bg-gray-200 space-x-5 justify-center items-center"}>
                <div className={"col-span-1 items-center flex justify-end "}>
                    <div className={"relative w-[200px] h-[200px]"}>
                        <Image
                            src={user.image}
                            alt={""}
                            fill
                            style={{borderRadius: "5px"}}
                        />
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