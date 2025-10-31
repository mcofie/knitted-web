"use client";

import { useEffect, useState } from "react";

export default function ClientTime({
                                       iso,
                                       placeholder,
                                   }: {
    iso: string;
    placeholder?: string;
}) {
    const [text, setText] = useState(placeholder ?? iso);

    useEffect(() => {
        const date = new Date(iso);
        if (isNaN(date.getTime())) {
            setText(placeholder ?? "Invalid date");
            return;
        }

        const day = date.getDate();
        const month = date.toLocaleString("en-GB", { month: "short" }); // Oct
        const year = date.getFullYear().toString().slice(-2); // 23
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "pm" : "am";
        const formattedHours = hours % 12 || 12;

        const suffix =
            day % 10 === 1 && day !== 11
                ? "st"
                : day % 10 === 2 && day !== 12
                    ? "nd"
                    : day % 10 === 3 && day !== 13
                        ? "rd"
                        : "th";

        setText(`${day}${suffix} ${month} ${year} • ${formattedHours}:${minutes} ${ampm}`);
    }, [iso, placeholder]);

    return <span>{text}</span>;
}