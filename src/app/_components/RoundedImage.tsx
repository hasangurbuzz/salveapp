import Image from "next/image";
import {shimmer, toBase64} from "@/lib/util";

export default function RoundedImage(props: Props) {
    const {imageUrl, alt} = props

    return (

        <div className={"relative aspect-square"}>
            <Image
                src={imageUrl}
                alt={alt}
                fill
                style={{borderRadius: "50%", objectFit: "cover"}}
                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1000, 1000))}`}
            />
        </div>

    )
}

type Props = {
    imageUrl: string,
    alt: string
}
