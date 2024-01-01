import {Conversation} from "@/lib/types/Conversation";
import {User} from "@/lib/types/User";
import {Message} from "@/lib/types/Message";
import ChatMessagesSection from "@/app/_components/ChatMessagesSection";
import {getUserSession} from "@/lib/session";
import {findConversationById} from "@/lib/firebase/firestore/conversationService";
import {extractReceiverUserFromConversation} from "@/lib/firebase/firestore/util";
import ChatLandingSection from "@/app/_components/sections/ChatLandingSection";


type Params = {
    params: {
        id: string
    }
}

type ChatPopoverItemData = {
    conversation: Conversation,
    sender: User,
    lastMessage: Message
}

export default async function Chat({
                                       params,
                                       searchParams,
                                   }: {
    params: { path: string };
    searchParams?: { id: string };
}) {
    const user = await getUserSession()
    let conversation
    let receiverUser
    if (searchParams && searchParams.id) {
        conversation = await findConversationById(searchParams.id)
        if (!conversation) return
        receiverUser = await extractReceiverUserFromConversation(conversation, user.id)
    }


    return (
        <>

            {
                conversation && receiverUser &&
                <ChatMessagesSection
                    user={user}
                    conversation={conversation}
                    receiverUser={receiverUser}
                />
            }
            {
                !conversation &&
                <ChatLandingSection/>
            }

        </>
    )
}