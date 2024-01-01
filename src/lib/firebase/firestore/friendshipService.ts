import {deleteDoc, getDocs, onSnapshot, query, QuerySnapshot, setDoc, where} from "@firebase/firestore";
import {getColRef, getDocRef} from "@/lib/firebase/core";
import {COL_FRIENDSHIPS, FIELD_PARTICIPANTS, OPERAND_ARRAY_CONTAINS, OPERAND_EQUALS} from "@/lib/firebase/constants";
import {friendshipConverter} from "@/lib/firebase/converters";
import {generateRandomId} from "@/lib/util";
import {User} from "@/lib/types/User";
import {findUserById} from "@/lib/firebase/firestore/userService";

export const deleteFriendship = async (participants: string[]) => {
    let q = query(
        getColRef(COL_FRIENDSHIPS, friendshipConverter),
        where(FIELD_PARTICIPANTS, OPERAND_EQUALS, [participants[0], participants[1]])
    )

    let result = await getDocs(q)
    if (!result.empty) {
        await deleteDoc(result.docs[0].ref)
        return
    }

    q = query(
        getColRef(COL_FRIENDSHIPS, friendshipConverter),
        where(FIELD_PARTICIPANTS, OPERAND_EQUALS, [participants[1], participants[0]])
    )

    result = await getDocs(q)

    if (!result.empty) {
        await deleteDoc(result.docs[0].ref)
    }
}

export const listenFriendship = (userId: string, onChange: (doc: QuerySnapshot) => void) => {
    const q = query(
        getColRef(COL_FRIENDSHIPS, friendshipConverter),
        where(FIELD_PARTICIPANTS, OPERAND_ARRAY_CONTAINS, userId)
    )
    return onSnapshot(q, onChange)
}

export const createFriendship = async (participants: string[]) => {
    const docRef = getDocRef(COL_FRIENDSHIPS, generateRandomId(), friendshipConverter)
    await setDoc(docRef, {
        participants: participants
    })
}

export const findFriends = async (userId: string) => {
    const friendShips = await findFriendships(userId)
    if (!friendShips) return null

    const users: User[] = []
    for (const f of friendShips) {
        const ids = f.participants.filter(id => id !== userId)
        const user = await findUserById(ids[0]);
        users.push(user!)
    }

    return users
}

export const findFriendships = async (userId: string) => {
    const q = query(
        getColRef(COL_FRIENDSHIPS, friendshipConverter),
        where(FIELD_PARTICIPANTS, OPERAND_ARRAY_CONTAINS, userId)
    )

    const docs = await getDocs(q)
    if (docs.empty) return null

    const friendShips = docs.docs
        .map((doc) => friendshipConverter.fromFirestore(doc, {}))

    return friendShips

}