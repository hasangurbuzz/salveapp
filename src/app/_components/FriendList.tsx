import FriendListItem from "@/app/_components/FriendListItem";
import {User} from "@/lib/types/User";

type Props = {
    users: User[]
}
export default function FriendList(props: Props) {
    const {users} = props
    return (
        <div className={"flex flex-col space-y-1"}>
            {
                users.map((user, index) => <FriendListItem key={index} user={user}/>)
            }
        </div>
    )
}