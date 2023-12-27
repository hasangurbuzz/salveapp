import {initializeApp} from "firebase/app";
import {firebaseConfig} from "../../../firebase.config";
import {getStorage, ref} from "@firebase/storage";
import {collection, doc, FirestoreDataConverter, getFirestore} from "@firebase/firestore";

const app = initializeApp(firebaseConfig);
const storage = getStorage()
const firestore = getFirestore()

export const getColRef = (path: string, converter: FirestoreDataConverter<any>, id?: string) => {
    return id
        ? collection(firestore, path, id).withConverter(converter)
        : collection(firestore, path).withConverter(converter)
}

export const getDocRef = (path: string, id: string, converter: FirestoreDataConverter<any>) => {
    return doc(firestore, path, id).withConverter(converter)
}

export const getFileRef = (path: string) => {
    return ref(storage, path)
}

export {app, storage, firestore}
