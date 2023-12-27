import {Timestamp} from "@firebase/firestore";


export type Post = {
    id: string,
    creatorId: string,
    creatorName: string,
    created_at: Timestamp
    content: string,
    image: string | null
}