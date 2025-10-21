"use client";
import {useEffect, useState} from "react";

export default function ClientTime({iso, placeholder}: { iso: string; placeholder?: string }) {
    const [text, setText] = useState(placeholder ?? iso); // equals SSR
    useEffect(() => {
        setText(new Date(iso).toLocaleString());
    }, [iso]);
    return <span>{text}</span>;
}