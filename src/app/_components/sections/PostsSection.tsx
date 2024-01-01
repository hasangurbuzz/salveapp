"use client"
import CreatePostModal from "@/app/_components/CreatePostModal";
import PostList from "@/app/_components/PostList";
import {Post} from "@/lib/types/Post";
import React, {useEffect, useState} from "react";
import {getFileUrl, uploadFile} from "@/lib/firebase/storage";
import {User} from "@/lib/types/User";
import {generateRandomId} from "@/lib/util"
import {Timestamp} from "@firebase/firestore";
import {postConverter} from "@/lib/firebase/converters";
import UserSearchBar from "@/app/_components/UserSearchBar";
import {createPost, listenPosts} from "@/lib/firebase/firestore/postService";
import {useRouter} from "next/navigation";


type Props = {
    user: User
}

export default function PostsSection(props: Props) {
    const router = useRouter()
    const {user} = props
    const [modalState, setModalState] = useState(false)
    const [data, setData] = useState<Post[]>([])
    const [loadingPost, setLoadingPost] = useState(false)
    const handleCreatePost = async (data: { image?: File, content: string }) => {
        setLoadingPost(true)
        const postId = generateRandomId()
        let imageUrl: string | null = null
        if (data.image) {
            await uploadFile("images/posts", `${postId}.jpg`, data.image)
            imageUrl = await getFileUrl("images/posts", `${postId}.jpg`)
        }
        const post: Post = {
            id: postId.toString(),
            created_at: Timestamp.now(),
            creatorId: user.id,
            creatorName: user.name,
            image: imageUrl,
            content: data.content
        }

        await createPost(post)
        setLoadingPost(false)
        setModalState(false)
    }

    useEffect(() => {
        const unsubscribe = listenPosts((querySnapshot) => {
            if (querySnapshot.docChanges().length === 0) return
            const posts = querySnapshot.docs.map(doc => postConverter.fromFirestore(doc, {}))
            setData(posts)
        })

        return () => {
            unsubscribe()
        }
    }, []);

    return (
        <div
            className={"mt-16 bg-gray-200 col-span-5 md:col-span-3 flex flex-col items-center"}>
            <UserSearchBar onSelect={(user) => {
                router.push(`/profile/${user.id}`)
            }}/>

            <button
                onClick={() => setModalState(true)}
                className={"text-blue-500 bg-white border-2 border-gray-300 rounded pl-10 pr-10 p-2 hover:bg-gray-200 font-semibold"}
            >Share a new post
            </button>

            {
                modalState &&

                <CreatePostModal
                    onClose={() => setModalState(false)}
                    onSubmit={handleCreatePost}
                    loading={loadingPost}
                />
            }
            <PostList data={data}/>
        </div>
    )
}