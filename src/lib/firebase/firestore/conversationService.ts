import {
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    QuerySnapshot,
    setDoc,
    Timestamp,
    where
} from "@firebase/firestore";
import {getColRef, getDocRef} from "@/lib/firebase/core";
import {
    COL_CONVERSATIONS,
    FIELD_PARTICIPANTS,
    FIELD_TIMESTAMP,
    OPERAND_ARRAY_CONTAINS,
    OPERAND_EQUALS,
    SORT_DESC
} from "@/lib/firebase/constants";
import {conversationConverter} from "@/lib/firebase/converters";
import {ConversationItem} from "@/lib/types/ConversationItem";
import {findMessageById} from "@/lib/firebase/firestore/messageService";
import {extractReceiverUserFromConversation} from "@/lib/firebase/firestore/util";
import {Conversation} from "@/lib/types/Conversation";
import {generateRandomId} from "@/lib/util";

export const listenConversations = (userId: string, onChange: (doc: QuerySnapshot) => void) => {
    const q = query(
        getColRef(COL_CONVERSATIONS, conversationConverter),
        where(FIELD_PARTICIPANTS, OPERAND_ARRAY_CONTAINS, userId),
        orderBy(FIELD_TIMESTAMP, SORT_DESC)
    )

    return onSnapshot(q, onChange)
}

export const createConversation = async (participants: string[], lastMessageId: string) => {
    const conversation: Conversation = {
        id: generateRandomId(),
        timestamp: Timestamp.now(),
        participants: participants,
        lastMessageId: lastMessageId
    }
    const docRef = getDocRef(COL_CONVERSATIONS, conversation.id, conversationConverter)
    await setDoc(docRef, conversation)
    return conversation
}

export const listenConversationItems = (userId: string, onChange: (conversationItems: ConversationItem[]) => void) => {
    const unsub = listenConversations(userId, async (doc) => {
        const conversations = doc.docs.map(doc => conversationConverter.fromFirestore(doc, {}))
        const conversationItems: ConversationItem[] = []
        for (let conversation of conversations) {
            const receiver = await extractReceiverUserFromConversation(conversation, userId)
            if (!receiver) {
                continue
            }

            const foundMessage = await findMessageById(conversation.lastMessageId!)
            if (!foundMessage) {
                continue
            }

            const conversationItem: ConversationItem = {
                conversation: conversation,
                receiver: receiver,
                lastMessage: foundMessage
            }
            conversationItems.push(conversationItem)
        }
        onChange(conversationItems)

    })
    return unsub

}

export const findConversationById = async (conversationId: string) => {
    const docRef = getDocRef(COL_CONVERSATIONS, conversationId, conversationConverter)
    const doc = await getDoc(docRef)

    if (!doc.exists()) return null

    const conversation = conversationConverter.fromFirestore(doc)
    return conversation

}

export const updateConversation = async (conversation: Conversation) => {
    const docRef = getDocRef(COL_CONVERSATIONS, conversation.id, conversationConverter)
    await setDoc(docRef, conversation)
}

export const findConversationByParticipants = async (participants: string[]) => {
    const colRef = getColRef(COL_CONVERSATIONS, conversationConverter)
    let q = query(
        colRef,
        where(FIELD_PARTICIPANTS, OPERAND_EQUALS, participants)
    )
    let result = await getDocs(q)

    if (!result.empty) {
        const conversation = result.docs
            .map(conversation => conversationConverter.fromFirestore(conversation))[0]
        return conversation
    }
    q = query(
        colRef,
        where(FIELD_PARTICIPANTS, OPERAND_EQUALS, participants.toReversed())
    )
    result = await getDocs(q)

    if (!result.empty) {
        const conversation = result.docs
            .map(conversation => conversationConverter.fromFirestore(conversation))[0]
        return conversation
    }
    return null
}