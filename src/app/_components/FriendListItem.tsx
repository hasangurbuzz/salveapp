"use client"
import {User} from "@/lib/types/User";
import {useRouter} from "next/navigation";
import RoundedImage from "@/app/_components/RoundedImage";


type Props = {
    user: User,
}

export default function FriendListItem(props: Props) {
    const {user} = props
    const router = useRouter()
    return (
        <div
            className={`border-2 p-2 rounded bg-white hover:border-black flex items-center cursor-pointer `}
            onClick={() => {
                router.push(`/profile/${user.id}`)
            }}
        >
            <div className={"relative w-[50px] h-[50px]"}>
                <RoundedImage imageUrl={user.image} alt={""}/>
            </div>
            <span className={"truncate text-black font-semibold md:w-[100px] lg:w-[150px]"}>{user.name}</span>
        </div>
    )
}