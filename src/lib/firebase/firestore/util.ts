import {Conversation} from "@/lib/types/Conversation";
import {findUserById} from "@/lib/firebase/firestore/userService";

export const extractReceiverUserFromConversation = async (conversation: Conversation, currentUserId: string) => {
    const receiverUserId = conversation.participants.filter(userId => userId !== currentUserId)[0]
    const user = await findUserById(receiverUserId)
    return user
}