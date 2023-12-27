import {User} from "@/lib/types/User";
import {DocumentData, QueryDocumentSnapshot, SnapshotOptions} from "@firebase/firestore";
import {Post} from "@/lib/types/Post";

export const userConverter = {
    toFirestore: (user: User): DocumentData => {
        return user
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): User => {
        const data = snapshot.data(options);
        return {
            id: data.id,
            image: data.image,
            email: data.email,
            name: data.name
        }
    }
};

export const postConverter = {
    toFirestore: (post: Post): DocumentData => {
        return post
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Post => {
        const data = snapshot.data(options);
        return {
            id: data.id,
            image: data.image,
            content: data.content,
            created_at: data.created_at,
            creatorId: data.creatorId,
            creatorName: data.creatorName
        }
    }
};

export const friendshipConverter = {
    toFirestore: (friendship: Friendship): DocumentData => {
        return friendship
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Friendship => {
        const data = snapshot.data(options);
        return {
            participants: data.participants
        }
    }
};

export const friendshipRequestConverter = {
    toFirestore: (friendshipRequest: FriendshipRequest): DocumentData => {
        return friendshipRequest
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FriendshipRequest => {
        const data = snapshot.data(options);
        return {
            receiverId: data.receiverId,
            senderId: data.senderId
        }
    }
};

