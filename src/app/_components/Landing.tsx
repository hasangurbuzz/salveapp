import Image from "next/image";
import socialImage from "../../../public/landing.jpg";

export default function Landing() {
    return (
        <main className={"landing flex justify-center"}>
            <div className={"h-screen w-11/12 relative"}>

                <Image
                    src={socialImage}
                    alt={""}
                    style={{objectFit: "cover"}}
                    placeholder={"blur"}
                    fill/>
                <div
                    className="opacity-0 hover:opacity-100 duration-300 absolute inset-0  flex justify-center items-center text-6xl text-white font-semibold">
                    The best way to socialize
                </div>
            </div>
        </main>
    )
}