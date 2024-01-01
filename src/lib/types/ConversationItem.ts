import {Conversation} from "@/lib/types/Conversation";
import {User} from "@/lib/types/User";
import {Message} from "@/lib/types/Message";

export type ConversationItem = {
    conversation: Conversation,
    receiver: User,
    lastMessage: Message
}