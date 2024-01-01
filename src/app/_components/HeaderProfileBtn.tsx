"use client"
import Image from "next/image";
import React from "react";
import {useRouter} from "next/navigation";
import {User} from "@/lib/types/User";

type Props = {
    user: User
}

export default function HeaderProfileBtn(props: Props) {
    const {user} = props
    const router = useRouter()

    const handleClick = () => {
        router.push(`profile/${user.id}`)
    }

    return (
        <Image
            onClick={handleClick}
            src={user.image}
            alt={""}
            width={40}
            height={40}
            style={{borderRadius: "15px"}}
        />
    )
}