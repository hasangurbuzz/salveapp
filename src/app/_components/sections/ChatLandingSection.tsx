import Link from "next/link";

export default function ChatLandingSection() {
    return (
        <div
            className={"flex-1 min-w-0 h-full shadow-md shadow-gray-700 flex-col flex justify-center items-center w-full text-xl"}>
            <p>No chats selected</p>
            <Link href={"/chat/new"} className={"hover:text-blue-600 sm:hidden underline"}>Create new one</Link>
        </div>
    )
}