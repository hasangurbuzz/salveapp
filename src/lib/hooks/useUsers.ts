import {useEffect, useState} from "react";
import {User} from "@/lib/types/User";
import {userConverter} from "@/lib/firebase/converters";
import {listenUsers} from "@/lib/firebase/firestore/userService";


const useUsers = (filterCurrentUser: boolean = false) => {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        const fetch = async () => {
            const unsubscribe = await listenUsers((doc) => {
                let fetched = doc.docs
                    .map(user => userConverter.fromFirestore(user, {}))

                setUsers(fetched)
            }, filterCurrentUser)

            return () => {
                unsubscribe()
            }
        }
        fetch()

    }, []);

    return users
}

export default useUsers