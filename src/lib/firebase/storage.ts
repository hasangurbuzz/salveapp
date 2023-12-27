import {getFileRef} from "@/lib/firebase/core";
import {getDownloadURL, uploadBytes} from "@firebase/storage";

export const getFileUrl = async (path: string, filename: string) => {
    return await getDownloadURL(getFileRef(`${path}/${filename}`))
}

export const getProfileImage = async (userId: string) => {
    try {
        return await getFileUrl("images", `${userId}.jpg`)
    } catch (e) {
        return await getFileUrl("images", "default_profile.png")
    }
}

export const uploadProfileImage = async (userId: string, file: File | ArrayBuffer) => {
    await uploadFile("images", `${userId}.jpg`, file)
}

export const uploadFile = async (path: string, filename: string, file: File | ArrayBuffer) => {
    await uploadBytes(getFileRef(`${path}/${filename}`), file)
}