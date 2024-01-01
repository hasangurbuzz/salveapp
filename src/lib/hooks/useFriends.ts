import {useEffect, useState} from "react";
import {User} from "@/lib/types/User";
import {findFriends} from "@/lib/firebase/firestore/friendshipService";

const useFriends = (userId: string) => {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        findFriends(userId)
            .then((friends) => {
                setUsers(friends || [])
            })
    }, []);

    return users
}

export default useFriends