import {Timestamp} from "@firebase/firestore";

export type Conversation = {
    id: string,
    lastMessageId?: string,
    participants: string[],
    timestamp: Timestamp
}