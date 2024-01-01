import ChatListSection from "@/app/_components/sections/ChatListSection";
import {getUserSession} from "@/lib/session";

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode
}) {

    const user = await getUserSession()


    return (
        <main className={"pt-14 h-screen overflow-hidden"}>
            <div className="flex h-full">

                <ChatListSection user={user}/>
                <div className={"flex-1 min-w-0 h-full shadow-md shadow-gray-700 flex-col flex"}>
                    {children}
                </div>
            </div>
        </main>
    )
}