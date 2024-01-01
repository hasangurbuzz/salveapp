import {deleteDoc, getDocs, onSnapshot, query, QuerySnapshot, setDoc, where} from "@firebase/firestore";
import {getColRef, getDocRef} from "@/lib/firebase/core";
import {COL_FRIENDSHIP_REQUESTS, FIELD_RECEIVER_ID, FIELD_SENDER_ID, OPERAND_EQUALS} from "@/lib/firebase/constants";
import {friendshipRequestConverter} from "@/lib/firebase/converters";
import {generateRandomId} from "@/lib/util";

export const deleteFriendshipRequest = async (senderId: string, receiverId: string) => {
    const q = query(
        getColRef(COL_FRIENDSHIP_REQUESTS, friendshipRequestConverter),
        where(FIELD_SENDER_ID, OPERAND_EQUALS, senderId),
        where(FIELD_RECEIVER_ID, OPERAND_EQUALS, receiverId)
    )

    const doc = await getDocs(q)

    if (doc.empty) return

    const docId = doc.docs[0].id

    await deleteDoc(getDocRef(COL_FRIENDSHIP_REQUESTS, docId, friendshipRequestConverter))

}

export const listenIncomingFriendshipRequests = (userId: string, onChange: (doc: QuerySnapshot) => void) => {
    const q = query(
        getColRef(COL_FRIENDSHIP_REQUESTS, friendshipRequestConverter),
        where(FIELD_RECEIVER_ID, OPERAND_EQUALS, userId)
    )
    return onSnapshot(q, onChange)
}

export const listenFriendshipRequest = (senderId: string, receiverId: string, onChange: (doc: QuerySnapshot) => void) => {
    const q = query(
        getColRef(COL_FRIENDSHIP_REQUESTS, friendshipRequestConverter),
        where(FIELD_SENDER_ID, OPERAND_EQUALS, senderId),
        where(FIELD_RECEIVER_ID, OPERAND_EQUALS, receiverId)
    )
    return onSnapshot(q, onChange)
}

export const createFriendshipRequest = async (senderId: string, receiverId: string) => {
    const ref = getDocRef(COL_FRIENDSHIP_REQUESTS, generateRandomId(), friendshipRequestConverter)
    const friendshipRequest: FriendshipRequest = {
        senderId: senderId,
        receiverId: receiverId
    }
    await setDoc(ref, friendshipRequest)
}
