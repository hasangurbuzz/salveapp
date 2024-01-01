"use client"
import {isDateToday} from "@/lib/util";
import {useRouter} from "next/navigation";
import RoundedImage from "@/app/_components/RoundedImage";
import {ConversationItem} from "@/lib/types/ConversationItem";

type Props = {
    conversationItem: ConversationItem
    onClick: () => void
}

export default function ChatPopoverItem(props: Props) {
    const {conversationItem, onClick} = props
    const {conversation, lastMessage, receiver} = conversationItem
    const router = useRouter()

    const handleClick = () => {
        onClick()
    }

    return (
        <div
            onClick={handleClick}
            className={"bg-white rounded p-2 flex flex-col hover:bg-gray-300 cursor-pointer"}>
            <div className={"flex items-center space-x-3 justify-around w-full "}>
                <div className={"relative w-[10%] h-[40px] sm:w-[50px] sm:h-[50px] flex justify-center"}>
                    <RoundedImage imageUrl={receiver.image} alt={""}/>
                </div>
                <div className={"flex flex-col sm:w-[60%] w-[50%]"}>
                    <p className={"font-semibold truncate text-sm sm:text-lg"}>{receiver.name}</p>
                    <p className={"sm:text-sm font-light truncate text-xs"}>{lastMessage.content}</p>
                </div>
                <div className={"font-light sm:text-sm text-xs text-end"}>
                    <p>{lastMessage.timestamp.toDate().toLocaleTimeString().slice(0, 5)}</p>
                    {
                        !isDateToday(lastMessage.timestamp.toDate()) &&
                        <p>{
                            lastMessage.timestamp.toDate().toLocaleDateString()
                        }</p>
                    }
                </div>
            </div>
        </div>
    )
}