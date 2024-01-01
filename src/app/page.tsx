import {getUserSession} from "@/lib/session";
import Landing from "@/app/_components/sections/Landing";
import PostsSection from "@/app/_components/sections/PostsSection";
import {User} from "@/lib/types/User";
import FriendsSection from "@/app/_components/sections/FriendsSection";

export default async function Home() {
    const user = await getUserSession()


    return (
        <>
            {!user && <Landing/>}
            {user &&
                <div className={"grid grid-cols-5 h-screen pt-16 bg-gray-200"}>

                    <FriendsSection user={user as User}/>
                    <PostsSection user={user as User}/>
                    <div className={"mt-16 bg-gray-200 col-span-1 flex flex-col items-center"}></div>
                </div>
            }
        </>
    )
}
