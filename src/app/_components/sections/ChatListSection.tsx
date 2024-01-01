"use client"
import {User} from "@/lib/types/User";
import ChatPopoverItem from "@/app/_components/ChatPopoverItem";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {ConversationItem} from "@/lib/types/ConversationItem";
import {listenConversationItems} from "@/lib/firebase/firestore/conversationService";

type Props = {
    user: User
}
export default function ChatListSection(props: Props) {
    const {user} = props
    const router = useRouter()
    const [conversationItems, setConversationItems] = useState<ConversationItem[]>([])

    useEffect(() => {
        listenConversationItems(user.id, (conversationItems) => {
            setConversationItems(conversationItems)
        })
    }, []);


    return (
        <div className={"w-1/3 lg:w-1/4 p-1 overflow-hidden space-y-1 hidden sm:block"}>
            <p
                onClick={() => router.push("/chat/new")}
                className={"text-center hover:text-blue-600 font-semibold cursor-pointer"}>
                Create new chat
            </p>
            <div className="w-full overflow-y-auto space-y-1 hidden sm:block">
                {
                    conversationItems.map((item, index) =>
                        <ChatPopoverItem
                            key={index}
                            conversationItem={item}
                            onClick={() => {
                                router.replace(`/chat?id=${item.conversation.id}`)
                            }}/>
                    )
                }
            </div>
        </div>
    )
}