"use client"
import {User} from "@/lib/types/User";
import {
    createFriendship,
    createFriendshipRequest,
    deleteFriendship,
    deleteFriendshipRequest,
    listenFriendship,
    listenFriendshipRequest
} from "@/lib/firebase/firestore";
import {useEffect, useState} from "react";
import {friendshipConverter, friendshipRequestConverter} from "@/lib/firebase/converters";

type Props = {
    user: User,
    currentUser: User
}

type PendingRequestState = {
    receivedRequest?: FriendshipRequest,
    sentRequest?: FriendshipRequest
}

export default function ModifyFriendship(props: Props) {
    const {user, currentUser} = props
    const [isFriend, setIsFriend] = useState<boolean>(false)
    const [pendingRequest, setPendingRequest] = useState<PendingRequestState>({})

    useEffect(() => {
        listenFriendshipRequest(user.id, currentUser.id, (doc) => {
            if (!doc.empty) {
                const incomingRequest = friendshipRequestConverter.fromFirestore(doc.docs[0], {})
                setPendingRequest({receivedRequest: incomingRequest})
            }
            if (doc.empty) {
                setPendingRequest(prevState => ({
                    ...prevState,
                    receivedRequest: undefined
                }))
            }
        })
        listenFriendshipRequest(currentUser.id, user.id, (doc) => {
            if (!doc.empty) {
                const sentRequest = friendshipRequestConverter.fromFirestore(doc.docs[0], {})
                setPendingRequest({sentRequest: sentRequest})
            }
            if (doc.empty) {
                setPendingRequest(prevState => ({
                    ...prevState,
                    sentRequest: undefined
                }))
            }
        })
        listenFriendship(currentUser.id, (doc) => {
            if (doc.empty) {
                setIsFriend(false)
            } else {
                const friendships = doc.docs.map(doc => friendshipConverter.fromFirestore(doc, {}))
                for (const f of friendships) {
                    const ids = f.participants.filter(id => id !== currentUser.id)
                    if (ids[0] === user.id) {
                        setIsFriend(true)
                    }
                }
            }
        })
    }, []);

    const handleSendFriendshipRequest = async () => {
        await createFriendshipRequest(currentUser.id, user.id)
    }

    const handleCancelFriendshipRequest = async () => {
        await deleteFriendshipRequest(pendingRequest.sentRequest?.senderId!, pendingRequest.sentRequest?.receiverId!)
    }

    const handleAcceptFriendship = async () => {
        await createFriendship([user.id, currentUser.id])
        await deleteFriendshipRequest(pendingRequest.receivedRequest?.senderId!, pendingRequest.receivedRequest?.receiverId!)
    }

    const handleRejectFriendshipRequest = async () => {
        await deleteFriendshipRequest(pendingRequest.receivedRequest?.senderId!, pendingRequest.receivedRequest?.receiverId!)
    }

    const handleRemoveFriendship = async () => {
        await deleteFriendship([user.id, currentUser.id])
    }

    return (
        <>
            {
                isFriend &&
                <>
                    <div className={"flex flex-col items-center"}>
                        <p className={"font-semibold"}>{user.name} is your friend</p>
                        <button
                            onClick={handleRemoveFriendship}
                            className={"bg-red-600 p-2 text-white font-semibold rounded"}>Unfriend
                        </button>
                    </div>
                </>
            }{
            !isFriend &&
            <>
                <div>
                    {
                        !(pendingRequest.sentRequest || pendingRequest.receivedRequest) &&
                        <button
                            onClick={handleSendFriendshipRequest}
                            className={"bg-blue-600 p-2 text-white font-semibold rounded"}>Add friend
                        </button>
                    }
                    {
                        (pendingRequest.sentRequest) &&
                        <div className={"flex flex-col items-center"}>
                            <p className={"font-semibold"}>You have sent friendship request</p>
                            <button
                                onClick={handleCancelFriendshipRequest}
                                className={"bg-red-600 p-2 text-white font-semibold rounded"}>Cancel
                            </button>
                        </div>
                    }
                    {
                        (pendingRequest.receivedRequest) &&
                        <div className={"flex flex-col items-center"}>
                            <p className={"font-semibold"}>You got new request. Accept it</p>
                            <div className={"flex space-x-2"}>
                                <button
                                    onClick={handleAcceptFriendship}
                                    className={"bg-blue-600 text-white font-semibold p-2 rounded"}>Accept
                                </button>
                                <button
                                    onClick={handleRejectFriendshipRequest}
                                    className={"bg-red-600 text-white font-semibold p-2 rounded"}>Decline
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </>
        }</>
    )
}