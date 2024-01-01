"use client"
import {User} from "@/lib/types/User";
import PostList from "@/app/_components/PostList";
import usePosts from "@/lib/hooks/usePosts";

type Props = {
    user: User
}

export default function ProfilePostsSection(props: Props) {
    const {user} = props
    const posts = usePosts(user.id)


    return (
        <>
            <p className={"font-semibold"}>Posts shared by {user.name}</p>
            <PostList data={posts}/>
        </>
    )

}
