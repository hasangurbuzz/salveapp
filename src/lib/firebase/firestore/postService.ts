import {getDocs, onSnapshot, orderBy, query, QuerySnapshot, setDoc, where} from "@firebase/firestore";
import {getColRef, getDocRef} from "@/lib/firebase/core";
import {COL_POSTS, FIELD_CREATED_AT, FIELD_CREATOR_ID, OPERAND_EQUALS, SORT_DESC} from "@/lib/firebase/constants";
import {postConverter} from "@/lib/firebase/converters";
import {Post} from "@/lib/types/Post";

export const findPostsByUserId = async (userId: string) => {
    const q = query(
        getColRef(COL_POSTS, postConverter),
        where(FIELD_CREATOR_ID, OPERAND_EQUALS, userId),
        orderBy(FIELD_CREATED_AT, SORT_DESC)
    )

    const docs = await getDocs(q)
    if (docs.empty) return null

    const posts = docs.docs.map(doc => postConverter.fromFirestore(doc, {}))
    return posts
}

export const listenPosts = (callback: (querySnapshot: QuerySnapshot) => void) => {
    const q = query(
        getColRef(COL_POSTS, postConverter),
        orderBy(FIELD_CREATED_AT, SORT_DESC)
    )
    return onSnapshot(q, (callback))
}

export const findAllPosts = async () => {
    const q = query(getColRef(COL_POSTS, postConverter))
    const docs = await getDocs(q)
    if (docs.empty) {
        return [] as Post[]
    }
    const posts = docs.docs
        .map(d => postConverter.fromFirestore(d, {}))

    return posts
}

export const createPost = async (post: Post) => {
    await setDoc(getDocRef(COL_POSTS, post.id, postConverter), post)
}
