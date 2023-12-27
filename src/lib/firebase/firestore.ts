import {User} from "@/lib/types/User";
import {
    deleteDoc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    QuerySnapshot,
    setDoc,
    where
} from "@firebase/firestore";
import {getColRef, getDocRef} from "@/lib/firebase/core";
import {getProfileImage, uploadProfileImage} from "@/lib/firebase/storage";
import {Post} from "@/lib/types/Post";
import {signOut} from "next-auth/react";
import {friendshipConverter, friendshipRequestConverter, postConverter, userConverter} from "@/lib/firebase/converters";
import {generateRandomId} from "@/lib/util";

export const createUser = async (user: User) => {
    await setDoc(getDocRef("users", user.id, userConverter), user)
    return true
}

export const findUserById = async (id: string) => {
    const data = await getDoc(getDocRef("users", id, userConverter))
    if (!data.exists()) {
        return null
    }

    const user = userConverter.fromFirestore(data, {})
    return user
}


export const findUserByEmail = async (email: string) => {
    const q = query(
        getColRef("users", userConverter),
        where("email", "==", email))
    const found = await getDocs(q)
    if (found.empty) {
        return null
    }

    const user: User = found.docs.pop()!.data()
    return user
}

export const updateUser = async (user: User) => {
    await setDoc(getDocRef("users", user.id, userConverter), user)
    return user
}

export const updateProfileImage = async (user: User, image: File) => {
    await uploadProfileImage(user.id, image)
    const url = await getProfileImage(user.id)
    user.image = url
    return await updateUser(user)
}

export const createPost = async (post: Post) => {
    await setDoc(getDocRef("posts", post.id, postConverter), post)
}

export const findAllPosts = async () => {
    const q = query(getColRef("posts", postConverter))
    const docs = await getDocs(q)
    if (docs.empty) {
        return [] as Post[]
    }
    console.log(docs)
    const posts = docs.docs
        .map(d => postConverter.fromFirestore(d, {}))

    return posts
}

export const listenPosts = (callback: (querySnapshot: QuerySnapshot) => void) => {
    const q = query(
        getColRef("posts", postConverter),
        orderBy("created_at", "desc")
    )
    onSnapshot(q, (callback))
}

export const listenCurrentUser = (userId: string) => {
    onSnapshot(getDocRef("users", userId, userConverter), (doc) => {
        if (!doc.exists()) {
            signOut({callbackUrl: "/"})
        }
    })
}

export const findFriendships = async (userId: string) => {
    const q = query(
        getColRef("friendships", friendshipConverter),
        where(`participants`, "array-contains", userId)
    )

    const docs = await getDocs(q)
    if (docs.empty) return null

    const friendShips = docs.docs
        .map((doc) => friendshipConverter.fromFirestore(doc, {}))

    return friendShips

}

export const findFriends = async (userId: string) => {
    const friendShips = await findFriendships(userId)
    if (!friendShips) return null

    const users: User[] = []
    for (const f of friendShips) {
        const ids = f.participants.filter(id => id !== userId)
        const user = await findUserById(ids[0])
        users.push(user!)
    }

    return users
}

export const findPostsByUserId = async (userId: string) => {
    const q = query(
        getColRef("posts", postConverter),
        where(`creatorId`, "==", userId),
        orderBy("created_at", "desc")
    )

    const docs = await getDocs(q)
    if (docs.empty) return null

    const posts = docs.docs.map(doc => postConverter.fromFirestore(doc, {}))
    return posts
}

export const createFriendshipRequest = async (senderId: string, receiverId: string) => {
    const ref = getDocRef("friendship_requests", generateRandomId(), friendshipRequestConverter)
    const friendshipRequest: FriendshipRequest = {
        senderId: senderId,
        receiverId: receiverId
    }
    await setDoc(ref, friendshipRequest)
}

export const listenFriendshipRequests = async (userId: string) => {
    const q = query(
        getColRef("friendship_requests", friendshipRequestConverter),
        where("receiverId", "==", userId)
    )

}

export const listenFriendshipRequest = (senderId: string, receiverId: string, onChange: (doc: QuerySnapshot) => void) => {
    const q = query(
        getColRef("friendship_requests", friendshipRequestConverter),
        where("senderId", "==", senderId),
        where("receiverId", "==", receiverId)
    )
    onSnapshot(q, onChange)
}

export const listenIncomingFriendshipRequests = (userId: string, onChange: (doc: QuerySnapshot) => void) => {
    const q = query(
        getColRef("friendship_requests", friendshipRequestConverter),
        where("receiverId", "==", userId)
    )
    onSnapshot(q, onChange)
}

export const deleteFriendshipRequest = async (senderId: string, receiverId: string) => {
    const q = query(
        getColRef("friendship_requests", friendshipRequestConverter),
        where("senderId", "==", senderId),
        where("receiverId", "==", receiverId)
    )

    const doc = await getDocs(q)

    if (doc.empty) return

    const docId = doc.docs[0].id

    await deleteDoc(getDocRef("friendship_requests", docId, friendshipRequestConverter))

}

export const createFriendship = async (participants: string[]) => {
    const docRef = getDocRef("friendships", generateRandomId(), friendshipConverter)
    await setDoc(docRef, {
        participants: participants
    })
}


export const listenFriendship = (userId: string, onChange: (doc: QuerySnapshot) => void) => {
    const q = query(
        getColRef("friendships", friendshipConverter),
        where("participants", "array-contains", userId)
    )
    onSnapshot(q, onChange)
}

export const deleteFriendship = async (participants: string[]) => {
    let q = query(
        getColRef("friendships", friendshipConverter),
        where("participants", "==", [participants[0], participants[1]])
    )

    let result = await getDocs(q)
    if (!result.empty) {
        await deleteDoc(result.docs[0].ref)
        return
    }

    q = query(
        getColRef("friendships", friendshipConverter),
        where("participants", "==", [participants[1], participants[0]])
    )

    result = await getDocs(q)

    if (!result.empty) {
        await deleteDoc(result.docs[0].ref)
    }
}

export const listenUsers = (onChange: (doc: QuerySnapshot) => void) => {
    const q = query(
        getColRef("users", userConverter),
    )
    onSnapshot(q, onChange)
}
