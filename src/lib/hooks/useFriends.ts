import {useEffect, useState} from "react";
import {findFriends} from "@/lib/firebase/firestore";
import {User} from "@/lib/types/User";

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