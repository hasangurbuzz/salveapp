"use client"

import {ChangeEvent} from "react";
import {trimString} from "@/lib/util";
import {InputType} from "@/lib/types/InputType";

type Props = {
    name: string
    onChange: (text: string, name: string) => void,
    value: string,
    placeholder: string,
    type: InputType
}

export default function TextInput(props: Props) {
    const {onChange, value, placeholder, type, name} = props

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        const input = trimString(e.target.value)
        onChange(input, name)
    }

    return (
        <input
            value={value}
            onChange={handleInput}
            placeholder={placeholder}
            className={"w-full bg-gray-200 rounded p-2"}
            type={type}
        />
    )
}