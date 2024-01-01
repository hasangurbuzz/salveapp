"use client"
import {useEffect} from "react";
import {User} from "next-auth";
import {listenCurrentUser} from "@/lib/firebase/firestore/userService";

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