import {Timestamp} from "@firebase/firestore";

type Props = {
    content: string,
    timestamp: Timestamp
}

export default function ReceivedMessageItem(props: Props) {
    const {content, timestamp} = props

    return (
        <div className="chat chat-start max-w-[90%] lg:w-[50%]">
            <div className="chat-bubble bg-white text-black">
                <p className={"whitespace-normal text-start"}>{content}</p>
                <p className={"text-xs text-start"}>{timestamp.toDate().toLocaleTimeString().slice(0, 5)}</p>
            </div>
        </div>
    )
}