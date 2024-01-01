import {getDoc, getDocs, onSnapshot, query, QuerySnapshot, setDoc, where} from "@firebase/firestore";
import {getColRef, getDocRef} from "@/lib/firebase/core";
import {COL_USERS, FIELD_EMAIL, FIELD_ID, OPERAND_EQUALS, OPERAND_NOT_EQUALS} from "@/lib/firebase/constants";
import {userConverter} from "@/lib/firebase/converters";
import {signOut} from "next-auth/react";
import {User} from "@/lib/types/User";
import {getProfileImage, uploadProfileImage} from "@/lib/firebase/storage";
import {getUserSession} from "@/lib/session";

export const listenUsers = async (onChange: (doc: QuerySnapshot) => void, filterCurrentUser: boolean = false) => {
    let q = query(
        getColRef(COL_USERS, userConverter),
    )
    if (filterCurrentUser) {
        const currentUser = await getUserSession()
        q = query(
            getColRef(COL_USERS, userConverter),
            where(FIELD_ID, OPERAND_NOT_EQUALS, currentUser.id)
        )
    }
    return onSnapshot(q, onChange)
}

export const listenCurrentUser = (userId: string) => {
    return onSnapshot(getDocRef(COL_USERS, userId, userConverter), (doc) => {
        if (!doc.exists()) {
            signOut({callbackUrl: "/"})
        }
    })
}

export const updateProfileImage = async (user: User, image: File) => {
    await uploadProfileImage(user.id, image)
    const url = await getProfileImage(user.id)
    user.image = url
    return await updateUser(user)
}

export const createUser = async (user: User) => {
    await setDoc(getDocRef(COL_USERS, user.id, userConverter), user)
    return true
}

export const findUserById = async (id: string) => {
    const data = await getDoc(getDocRef(COL_USERS, id, userConverter))
    if (!data.exists()) {
        return null
    }

    const user = userConverter.fromFirestore(data, {})
    return user
}


export const findUserByEmail = async (email: string) => {
    const q = query(
        getColRef(COL_USERS, userConverter),
        where(FIELD_EMAIL, OPERAND_EQUALS, email))
    const found = await getDocs(q)
    if (found.empty) {
        return null
    }

    const user: User = found.docs.pop()!.data()
    return user
}

export const updateUser = async (user: User) => {
    await setDoc(getDocRef(COL_USERS, user.id, userConverter), user)
    return user
}
