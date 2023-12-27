"use client"
import React, {ChangeEvent, useState} from "react";
import Image from "next/image";
import placeholder from "@/../public/placeholder.png"
import {shimmer, toBase64} from "@/lib/util";


type Props = {
    onClose: () => void,
    onSubmit: (data: ModalData) => void,
    loading: boolean
}

type ModalData = {
    content: string,
    image?: File
}
export default function CreatePostModal(props: Props) {
    const {onClose, onSubmit, loading} = props
    const [modalData, setModalData] = useState<ModalData>({content: "", image: undefined})

    const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setModalData(
            prev => ({...prev, content: e.target.value})
        )
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) {
            return
        }
        setModalData(
            prev => ({...prev, image: files[0]})
        )
    }

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper" || e.target.id === "btn-close") onClose()
    }

    return (
        <div id={"wrapper"} onClick={(e) => handleClose(e)}
             className={"z-10 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"}>
            {loading &&
                <div
                    className={"w-screen h-screen fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-20"}>
                    <div className={"bg-white p-5 rounded relative"}>
                        <p className={"z-40 font-semibold text-xl text-white relative"}>Creating post</p>
                        <Image
                            src={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                            alt={""}
                            fill
                            style={{borderRadius: 5}}
                        />
                    </div>
                </div>}
            <div className={"w-[600px]"}>
                <div className={"z-50 bg-white p-2 space-y-4 rounded flex flex-col items-center"}>
                    <div className={"flex w-full justify-between"}>
                        <p className={"font-semibold text-xl"}>Create new post</p>
                        <button
                            id={"btn-close"}
                            onClick={(e) => handleClose(e)}
                            className={"bg-red-500 pl-3 pr-3 rounded text-white"}
                        >x
                        </button>
                    </div>
                    <textarea rows={7} placeholder={"What do you want to share?"}
                              className={"w-full border-2 rounded p-2 resize-none"}
                              onChange={handleContentChange}
                    />
                    <div className={"h-[100px] w-[100px] flex-col flex relative"}>
                        <Image
                            src={modalData.image ? URL.createObjectURL(modalData.image) : placeholder}
                            alt={""}
                            fill
                            style={{objectFit: "cover"}}
                        />
                    </div>

                    <div className={"flex w-full flex-col space-y-1 items-center"}>
                        <label className={"bg-blue-500 p-2 pl-3 pr-3 text-white font-semibold rounded"}>
                            {modalData.image ? "Change image" : "Pick image"}
                            <input type={"file"} accept={"image/jpeg"} className={"border-2"} hidden
                                   onChange={handleImageChange}
                            />

                        </label>
                        <button
                            onClick={() => onSubmit(modalData)}
                            className={"bg-blue-500 p-2 pl-3 pr-3 text-white font-semibold rounded"}>Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}