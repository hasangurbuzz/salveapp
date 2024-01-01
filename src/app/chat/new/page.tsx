import CreateChatSection from "@/app/_components/sections/CreateChatSection";
import {getUserSession} from "@/lib/session";

export default async function NewChat() {
    const user = await getUserSession()

    return (
        <>
            <CreateChatSection user={user}/>

        </>
    )
}