import {useEffect, useState} from "react";
import {Post} from "@/lib/types/Post";
import {findPostsByUserId} from "@/lib/firebase/firestore/postService";

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