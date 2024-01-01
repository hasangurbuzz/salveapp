import PaperIcon from "@/app/_components/PaperIcon";
import {ChangeEvent, FormEvent, useState} from "react";
import {trimString} from "@/lib/util";

type Props = {
    onSubmit: (message: string) => void,
}

export default function SendMessageForm(props: Props) {
    const {onSubmit} = props

    const [messageInput, setMessageInput] = useState<string>("")

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (messageInput.trim().length > 0) {
            onSubmit(messageInput)
            setMessageInput("")
        }
    }

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        const input = trimString(e.target.value)
        setMessageInput(input)
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={"bg-white space-x-2 p-2 w-full h-14 flex items-center"}>
            <div className={"flex-grow"}>
                <input
                    value={messageInput}
                    onChange={handleInput}
                    placeholder={"Enter text to send"}
                    className={"w-full bg-gray-200 rounded p-2"}/>
            </div>
            <div className={"w-fit"}>
                <PaperIcon
                    type={"submit"}
                    onClick={handleSubmit}
                    width={30}
                    className={`
                                ${messageInput.length == 0
                        ? 'fill-gray-500'
                        : 'fill-blue-600'
                    } 
                                cursor-pointer`}
                />
            </div>
        </form>
    )
}