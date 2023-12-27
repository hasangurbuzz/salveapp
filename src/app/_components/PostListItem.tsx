"use client"
import {Post} from "@/lib/types/Post";
import Image from "next/image";
import {getProfileImage} from "@/lib/firebase/storage";
import {useEffect, useState} from "react";
import {shimmer, toBase64} from "@/lib/util";
import error from "@/../public/error.png"
import {useRouter} from "next/navigation";

type Props = {
    post: Post
}

export default function PostListItem(props: Props) {
    const {post} = props
    const [creatorImage, setCreatorImage] = useState<string>()
    const router = useRouter()


    useEffect(() => {
        getProfileImage(post.creatorId)
            .then(url => setCreatorImage(url))
    }, []);

    return (
        <div className={"border flex flex-col items-center space-y-1 rounded bg-white p-3 sm:max-w-[500px] w-full"}>
            <div className={"flex w-full justify-between items-center"}>
                <div
                    onClick={() => {
                        router.push(`/profile/${post.creatorId}`)
                    }}
                    className={"cursor-pointer flex items-center space-x-1"}>
                    {creatorImage &&
                        <div className={"w-[40px] h-[40px] relative"}>
                            <Image
                                src={creatorImage!}
                                alt={""}
                                fill
                                style={{borderRadius: "10px", objectFit: "cover"}}
                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                                onError={(e) => {
                                    setCreatorImage(error.src)
                                }}
                            />
                        </div>
                    }
                    <p className={"font-semibold"}>{post.creatorName}</p>
                </div>
                <div className={"flex flex-col items-center"}>
                    <p className={"font-light text-sm"}>{`${post.created_at.toDate().toLocaleTimeString()}`}</p>
                    <p className={"font-light text-sm"}>{`${post.created_at.toDate().toLocaleDateString()}`}</p>
                </div>
            </div>
            <div className={"border border-gray-300 w-full"}/>
            <div className={"w-full"}>
                <p className={"whitespace-normal"}>{post.content}</p>
            </div>
            {
                post.image &&
                <Image
                    src={post.image!}
                    alt={""}
                    width={500}
                    height={200}
                    placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                />
            }
        </div>
    );
}