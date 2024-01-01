"use client"

import {BellIcon} from "@heroicons/react/20/solid";
import {useEffect, useState} from "react";
import {friendshipRequestConverter} from "@/lib/firebase/converters";
import NotificationItem from "@/app/_components/NotificationItem";
import {listenIncomingFriendshipRequests} from "@/lib/firebase/firestore/friendshipRequestService";
import {findUserById} from "@/lib/firebase/firestore/userService";

type Props = {
    userId: string
}

type Notification = {
    content: string,
    userId: string
}

export default function NotificationPopover(props: Props) {
    const {userId} = props
    const [isPopped, setIsPopped] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") setIsPopped(false)
    }

    useEffect(() => {
        const unsubscribe = listenIncomingFriendshipRequests(userId, (doc) => {

            const requests = doc.docs.map(doc => friendshipRequestConverter.fromFirestore(doc, {}))
            if (requests.length > 0) {
                for (let request of requests) {
                    findUserById(request.senderId)
                        .then(user => {
                            if (user) {
                                const notification: Notification = {
                                    content: `${user.name} sent you friendship request`,
                                    userId: user.id
                                }
                                setNotifications(prev =>
                                    [...prev, notification]
                                )
                            }
                        })
                }
            } else {
                setNotifications([])
            }
        })

        return () => {
            unsubscribe()
        }
    }, []);

    return (

        <>

            <div className={"relative mr-14"} onClick={() => setIsPopped(true)}>
                <div className={"absolute inset-2.5 -inset-y-2.5 p-4 cursor-pointer z-30"}>
                    <p className={"text-white font-bold"}>
                        {notifications.length > 0 && notifications.length}
                    </p>
                </div>
                <div className={"absolute -inset-y-4 -inset-x-1.5 p-4 cursor-pointer"}>
                    <BellIcon cursor={"pointer"} className={"w-[40px] fill-blue-600 "}/>
                </div>
            </div>
            {
                isPopped &&
                <div
                    id={"wrapper"} onClick={handleClose}
                    className={"z-30 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"}>
                    <div className={"rounded fixed top-16 md:right-[20%] bg-gray-200 p-5"}>
                        {
                            notifications.length === 0 &&
                            <p>There are not any new notifications</p>
                        }
                        {
                            notifications.length > 0 &&

                            notifications.map((notification, index) =>
                                <NotificationItem
                                    key={index}
                                    notification={notification}
                                    onClick={() => setIsPopped(false)}/>)

                        }
                    </div>
                </div>
            }

        </>


    )
}