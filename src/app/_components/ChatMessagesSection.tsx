"use client"
import {useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {Message} from "@/lib/types/Message";
import {Conversation} from "@/lib/types/Conversation";
import {User} from "@/lib/types/User";
import RoundedImage from "@/app/_components/RoundedImage";
import {listenMessagesByConversationId, sendMessage, updateMessage} from "@/lib/firebase/firestore/messageService";
import SentMessageItem from "@/app/_components/SentMessageItem";
import ReceivedMessageItem from "@/app/_components/ReceivedMessageItem";
import {MessageStatus} from "@/lib/types/MessageStatus";
import {Timestamp} from "@firebase/firestore";
import {updateConversation} from "@/lib/firebase/firestore/conversationService";
import SendMessageForm from "@/app/_components/SendMessageForm";

type Props = {
    user: User,
    conversation: Conversation,
    receiverUser: User
}

type State = {
    messages: Message[]
}

export default function ChatMessagesSection(props: Props) {
    const {user, receiverUser, conversation} = props
    const params = useSearchParams()
    const [messages, setMessages] = useState<Message[]>([])
    const [state, setState] = useState<State>({
        messages: []
    })
    useEffect(() => {
        const unsub = listenMessagesByConversationId(conversation.id, (messages) => {
            setState(prev => ({
                ...prev,
                messages: messages
            }))
        })

        return () => {
            unsub()
        }

    }, []);


    const handleSubmit = (message: string) => {
        sendMessage(message, conversation, user.id)
    }

    return (
        <div className={"flex-1 min-w-0 h-full shadow-md shadow-gray-700 flex-col flex"}>
            <div
                className={"w-full flex items-center justify-center sm:justify-start space-x-2 border border-gray-300 bg-white p-2"}>
                <div className={"relative w-10"}>
                    <RoundedImage imageUrl={receiverUser.image} alt={""}/>
                </div>
                <p>{receiverUser.name}</p>
            </div>
            <div className={`h-full overflow-y-auto`}>
                {
                    state.messages.map((item, index) => {
                        if (isMessageSent(item, user)) {
                            return (
                                <div
                                    className={"flex flex-col items-end"}
                                    ref={(el) => {
                                        if (state.messages.length - 1 === index) {
                                            el?.scrollIntoView({behavior: "smooth", block: "center"})
                                        }
                                    }}
                                    key={index}>
                                    <SentMessageItem
                                        content={item.content}
                                        timestamp={item.timestamp}
                                        status={item.status}
                                    />
                                    {
                                        state.messages.length - 1 === index && item.status === MessageStatus.SEEN &&
                                        <p className={"text-xs pr-2"}>Seen</p>
                                    }
                                </div>
                            )
                        } else {
                            return (
                                <div
                                    className={"flex justify-start"}
                                    ref={(el) => {
                                        if (state.messages.length - 1 === index) {
                                            el?.scrollIntoView({behavior: "smooth", block: "center"})
                                            if (item.status === MessageStatus.SENT) {
                                                item.status = MessageStatus.SEEN
                                                updateMessage(item)
                                                conversation.timestamp = Timestamp.now()
                                                updateConversation(conversation)
                                            }
                                        }
                                    }}
                                    key={index}>
                                    <ReceivedMessageItem
                                        content={item.content}
                                        timestamp={item.timestamp}
                                    />
                                </div>
                            )
                        }
                    })
                }
            </div>
            <SendMessageForm onSubmit={handleSubmit}/>

        </div>
    )
}

const isMessageSent = (message: Message, currentUser: User) => {
    return message.senderId === currentUser.id
}