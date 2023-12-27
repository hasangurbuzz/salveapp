import {shimmer, toBase64} from "@/lib/util";
import Image from "next/image";

export default function Loading() {
    return (
        <div className={"w-screen h-screen"}>
            <div className={"fixed inset-0 bg-opacity-25 backdrop-blur-sm flex items-center justify-center"}>
                <p className={"z-20 text-5xl text-white font-bold"}>Salve</p>
                <Image
                    src={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
                    alt={""}
                    fill
                />
            </div>
        </div>
    )
}