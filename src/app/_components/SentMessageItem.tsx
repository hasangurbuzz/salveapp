import {Timestamp} from "@firebase/firestore";
import {MessageStatus} from "@/lib/types/MessageStatus";

type Props = {
    content: string,
    timestamp: Timestamp,
    status: MessageStatus
}
export default function SentMessageItem(props: Props) {

    const {content, timestamp, status} = props

    return (
        <div className="chat chat-end max-w-[90%] lg:w-[50%]">
            <div className="chat-bubble bg-blue-600">
                <p>{content}</p>
                <p className={"text-xs text-end"}>{timestamp.toDate().toLocaleTimeString().slice(0, 5)}</p>
            </div>

        </div>
    )

}