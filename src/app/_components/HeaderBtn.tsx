"use client"
import {useRouter} from "next/navigation";

type Props = {
    content: string,
    className: string,
    redirectPath: string
}


export default function HeaderBtn(props: Props) {
    const {content, className, redirectPath} = props
    const router = useRouter()

    return (
        <button className={`header-button ${className}`}
                onClick={() => {
                    router.push(redirectPath)
                }}
        >
            <p> {content}</p>

        </button>
    )
}
