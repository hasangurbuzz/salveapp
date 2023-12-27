import {useRouter} from "next/navigation";


type Notification = {
    content: string,
    userId: string
}

type Props = {
    notification: Notification,
    onClick: () => void
}

export default function NotificationItem(props: Props) {
    const {notification, onClick} = props
    const {userId, content} = notification

    const router = useRouter()

    const handleClick = () => {
        router.push(`/profile/${userId}`)
        onClick()
    }
    return (
        <div
            className={"border p-2 bg-white rounded font-semibold cursor-pointer hover:bg-gray-100"}
            onClick={handleClick}
        >
            {content}
        </div>
    )
}