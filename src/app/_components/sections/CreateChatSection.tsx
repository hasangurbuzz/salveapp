"use client"
import {User} from "@/lib/types/User";
import UserSearchBar from "@/app/_components/UserSearchBar";
import {createConversation, findConversationByParticipants} from "@/lib/firebase/firestore/conversationService";
import {useRouter} from "next/navigation";
import {useState} from "react";
import RoundedImage from "@/app/_components/RoundedImage";
import SendMessageForm from "@/app/_components/SendMessageForm";
import {createMessage, updateMessage} from "@/lib/firebase/firestore/messageService";

type Props = {
    user: User
}

type State = {
    selectedUser?: User
}

export default function CreateChatSection(props: Props) {
    const {user} = props
    const router = useRouter()
    const [state, setState] = useState<State>({})

    const handleUserSelect = async (selectedUser: User) => {
        const existingConversation = await findConversationByParticipants([user.id, selectedUser.id])
        if (existingConversation) {
            router.push(`/chat?id=${existingConversation.id}`)
            return
        }

        setState(prev => ({
            ...prev,
            selectedUser: selectedUser
        }))
    }

    const handleSendMessage = async (messageContent: string) => {
        let message = await createMessage(messageContent, user.id)
        const conversation = await createConversation(
            [user.id, state.selectedUser?.id!],
            message.id
        )
        message.conversationId = conversation.id
        await updateMessage(message)
        router.push(`/chat?id=${conversation.id}`)
    }

    return (
        <div className={"flex flex-col items-center"}>
            <UserSearchBar
                onSelect={handleUserSelect}
                filterCurrentUser={true}
            />

            {
                state.selectedUser &&
                <div className={"flex pt-14 flex-col items-center"}>
                    <div className={"w-[50px] relative"}>
                        <RoundedImage imageUrl={state.selectedUser.image} alt={""}/>
                    </div>
                    <p>{state.selectedUser.name}</p>
                    <SendMessageForm onSubmit={handleSendMessage}/>
                </div>
            }
        </div>
    )
}