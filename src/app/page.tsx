import {getUserSession} from "@/lib/session";
import Landing from "@/app/_components/Landing";
import PostsSection from "@/app/_components/PostsSection";
import {User} from "@/lib/types/User";
import FriendsSection from "@/app/_components/FriendsSection";

export default async function Home() {
    const user = await getUserSession()


    return (
        <>
            {!user && <Landing/>}
            {user &&
                <div className={"grid grid-cols-5 h-screen pt-16 bg-gray-200"}>
                    <div
                        className={"flex-col col-span-1 overflow-y-auto items-center md:flex hidden overflow-x-hidden bg-gray-200"}>
                        <FriendsSection user={user as User}/>

                    </div>


                    <PostsSection user={user as User}/>


                </div>
            }
        </>
    )
}
