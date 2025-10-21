"use client";

import {useEffect} from "react";
import {usePathname, useSearchParams} from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Optional: style tweak
NProgress.configure({showSpinner: false, speed: 400, minimum: 0.25});

export default function PageLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.start();
        const timer = setTimeout(() => NProgress.done(), 300); // slight delay for smooth feel
        return () => {
            clearTimeout(timer);
            NProgress.done();
        };
    }, [pathname, searchParams]);

    return null;
}