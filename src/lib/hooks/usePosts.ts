import {useEffect, useState} from "react";
import {findPostsByUserId} from "@/lib/firebase/firestore";
import {Post} from "@/lib/types/Post";

const usePosts = (userId: string) => {
    const [posts, setPosts] = useState<Post[]>([])

    useEffect(() => {
        findPostsByUserId(userId)
            .then((foundPosts) => {
                setPosts(foundPosts || [])
            })
    }, []);

    return posts
}

export default usePosts