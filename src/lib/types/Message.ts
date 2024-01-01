import {Timestamp} from "@firebase/firestore";
import {MessageStatus} from "@/lib/types/MessageStatus";

export type Message = {
    id: string,
    senderId: string,
    conversationId: string | null,
    content: string,
    timestamp: Timestamp,
    status: MessageStatus
}