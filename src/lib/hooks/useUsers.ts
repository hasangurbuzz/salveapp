import {useEffect, useState} from "react";
import {User} from "@/lib/types/User";
import {listenUsers} from "@/lib/firebase/firestore";
import {userConverter} from "@/lib/firebase/converters";


const useUsers = () => {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        listenUsers((doc) => {
            const fetched = doc.docs.map(user => userConverter.fromFirestore(user, {}))
            setUsers(fetched)
        })

    }, []);

    return users
}

export default useUsers