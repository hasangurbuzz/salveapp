import {getDoc, onSnapshot, orderBy, query, setDoc, Timestamp, where} from "@firebase/firestore";
import {getColRef, getDocRef} from "@/lib/firebase/core";
import {COL_MESSAGES, FIELD_CONVERSATION_ID, FIELD_TIMESTAMP, OPERAND_EQUALS, SORT_ASC} from "@/lib/firebase/constants";
import {messageConverter} from "@/lib/firebase/converters";
import {Message} from "@/lib/types/Message";
import {generateRandomId} from "@/lib/util";
import {Conversation} from "@/lib/types/Conversation";
import {updateConversation} from "@/lib/firebase/firestore/conversationService";
import {MessageStatus} from "@/lib/types/MessageStatus";

export const findMessageById = async (messageId: string) => {
    const docRef = getDocRef(COL_MESSAGES, messageId, messageConverter)

    const doc = await getDoc(docRef)
    if (!doc.exists()) return null

    const message = messageConverter.fromFirestore(doc, {})
    return message

}

export const listenMessagesByConversationId = (conversationId: string, onChange: (messages: Message[]) => void) => {
    const colRef = getColRef(COL_MESSAGES, messageConverter)

    const q = query(
        colRef,
        where(FIELD_CONVERSATION_ID, OPERAND_EQUALS, conversationId),
        orderBy(FIELD_TIMESTAMP, SORT_ASC)
    )

    const unsub = onSnapshot(q, (doc) => {
        const messages = doc.docs.map(doc => messageConverter.fromFirestore(doc, {}))
        onChange(messages)
    })

    return unsub
}

export const sendMessage = async (content: string, conversation: Conversation, userId: string) => {
    const message = await createMessage(content, userId, conversation.id)

    conversation.lastMessageId = message.id
    await updateConversation(conversation)


}

export const createMessage = async (content: string, senderId: string, conversationId?: string) => {
    const message: Message = {
        id: generateRandomId(),
        content: content,
        timestamp: Timestamp.now(),
        conversationId: conversationId || null,
        senderId: senderId,
        status: MessageStatus.SENT
    }
    const docRef = getDocRef(COL_MESSAGES, message.id, messageConverter)
    await setDoc(docRef, message)
    return message
}

export const updateMessage = async (message: Message) => {
    const docRef = getDocRef(COL_MESSAGES, message.id, messageConverter)
    await setDoc(docRef, message)
}