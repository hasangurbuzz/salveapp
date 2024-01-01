"use client"
import FriendList from "@/app/_components/FriendList";
import {User} from "@/lib/types/User";
import useFriends from "@/lib/hooks/useFriends";

type Props = {
    user: User
}

export default function FriendsSection(props: Props) {
    const {user} = props
    const friends = useFriends(user.id)

    return (
        <div
            className={"flex-col col-span-1 overflow-y-auto items-center md:flex hidden overflow-x-hidden bg-gray-200"}>
            {friends.length > 0 &&
                <>
                    <p className={"font-semibold"}>Your friends</p>
                    <FriendList users={friends}/>

                </>
            }
            {
                friends.length === 0 &&
                <div className={"w-full flex flex-col items-center justify-center"}>
                    <p className={"font-semibold whitespace-normal text-center"}>You have not added any
                        friends</p>
                </div>
            }
        </div>
    )
}