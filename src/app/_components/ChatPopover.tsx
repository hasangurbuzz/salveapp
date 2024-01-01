"use client"
import {useEffect, useState} from "react";
import bubbleIcon from "@/../public/bubble.svg"
import Image from "next/image";
import {Conversation} from "@/lib/types/Conversation";
import {listenConversationItems} from "@/lib/firebase/firestore/conversationService";
import {User} from "@/lib/types/User";
import {Message} from "@/lib/types/Message";
import ChatPopoverItem from "@/app/_components/ChatPopoverItem";
import {useRouter} from "next/navigation";
import {ConversationItem} from "@/lib/types/ConversationItem";
import {MessageStatus} from "@/lib/types/MessageStatus";

type Props = {
    user: User
}

type ChatPopoverItemData = {
    conversation: Conversation,
    sender: User,
    lastMessage: Message
}

type State = {
    conversationItem: ConversationItem[],
    unreadMessages: number
}

export default function ChatPopover(props: Props) {
    const {user} = props
    const [isPopped, setIsPopped] = useState(false)
    const [chatPopoverItems, setChatPopoverItems] = useState<ConversationItem[]>([])
    const [state, setState] = useState<State>({
        unreadMessages: 0,
        conversationItem: []
    })
    const router = useRouter()

    useEffect(() => {
        const unsub = listenConversationItems(user.id, (conversationItems) => {
            const unreadMessages = conversationItems
                .filter(item => item.lastMessage.senderId !== user.id)
                .filter(item => item.lastMessage.status === MessageStatus.SENT)
                .length


            setState({
                conversationItem: conversationItems,
                unreadMessages: unreadMessages
            })
        })

        return () => {
            unsub()
        }
    }, []);

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") setIsPopped(false)
    }

    return (
        <>
            <div className={"relative mr-8"} onClick={() => setIsPopped(true)}>
                <div className={"absolute items-center -inset-x-0.5 -inset-y-2 p-4 cursor-pointer z-30"}>
                    <p className={"text-white font-bold"}>
                        {
                            state.unreadMessages > 0 && state.unreadMessages
                        }
                        {
                            state.unreadMessages > 9 && 9
                        }
                    </p>
                </div>
                <div className={"absolute -inset-y-4 p-4 cursor-pointer w-[39px] "}>
                    <Image
                        src={bubbleIcon}
                        alt={""}
                        fill
                    />
                </div>
            </div>
            {
                isPopped &&
                <div
                    id={"wrapper"} onClick={handleClose}
                    className={`z-30 ${isPopped && 'z-40'} fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center`}>
                    <div
                        className={"rounded sm:w-96 w-[90%] fixed top-16 md:right-[20%] bg-gray-200 p-2 max-h-[80%] overflow-y-auto overflow-x-hidden space-y-1"}>
                        {
                            state.unreadMessages === 0 &&
                            <>
                                <p className={"p-2 text-center"}>There are not any new messages</p>
                                <p
                                    onClick={() => {
                                        router.push("/chat")
                                        setIsPopped(false)
                                    }}
                                    className={"text-blue-500 font-semibold text-center cursor-pointer hover:underline"}>
                                    Open chats
                                </p>

                            </>

                        }
                        {
                            state.unreadMessages > 0 &&
                            <>
                                <p className={"text-center font-semibold"}>Messages</p>
                                {
                                    state.conversationItem.map((item, index) => {
                                            return (
                                                <ChatPopoverItem
                                                    key={index}
                                                    conversationItem={item}
                                                    onClick={() => {
                                                        setIsPopped(false)
                                                        router.push(`/chat?id=${item.conversation.id}`)
                                                    }}
                                                />

                                            )
                                        }
                                    )
                                }
                                <p
                                    onClick={() => {
                                        router.push("/chat")
                                        setIsPopped(false)
                                    }}
                                    className={"text-blue-500 font-semibold text-center cursor-pointer hover:underline"}>
                                    See all messages
                                </p>
                            </>
                        }

                    </div>
                </div>
            }
        </>
    )
}