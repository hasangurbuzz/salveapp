"use client"
import {ChangeEvent} from "react";
import {updateProfileImage} from "@/lib/firebase/firestore";
import {User} from "@/lib/types/User";

type Props = {
    user: User
}

export default function UploadImage(props: Props) {
    const {user} = props


    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const updatedUser = await updateProfileImage(user, e.target.files[0])


        }

    }

    return (
        <label>
            <input
                type={"file"}
                hidden
                accept={"image/jpeg"}
                onChange={
                    handleChange
                }
            />
            <div>clcik</div>
        </label>
    )
}