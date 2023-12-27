"use client"
import {useEffect} from "react";
import {listenCurrentUser} from "@/lib/firebase/firestore";
import {User} from "next-auth";

type Props = {
    user: User
}

export default function UserContext(props: Props) {

    const {user} = props

    useEffect(() => {
        listenCurrentUser(user.id)
    }, []);

    return <>
    </>
}