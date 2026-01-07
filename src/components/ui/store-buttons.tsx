"use client";

import Link from "next/link";

export function AppleStoreButton({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="#"
      className={`inline-flex items-center justify-center rounded-xl border px-5 py-2.5 transition-all hover:scale-105 active:scale-95 duration-200 group ${
        dark
          ? "bg-black text-white border-white/20 shadow-lg shadow-black/20 hover:bg-zinc-900"
          : "bg-foreground text-background border-transparent shadow-xl hover:bg-foreground/90"
      }`}
    >
      <svg
        viewBox="0 0 384 512"
        width="22"
        height="22"
        className="fill-current mr-3 pb-1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 39.3 8.1 85.1 28 112.5 26.3 36 57.6 25.6 77.2 25.6 19.3 0 47.1-16.7 82.3-16.7 33 0 54.3 16.4 83.1 16.4 20.6 0 55.4-16.2 82.3-51.5-12.2-12.4-23-28.9-28.2-61.1zm-40-164.6c18.5-20.9 28.1-49.4 24.1-77.9-29.2 2.5-56.1 19.8-73.6 42.1-17.1 21.6-26.1 48-24.1 76.8 28.5 2.1 55.4-18.1 73.6-41z" />
      </svg>
      <div className="text-left">
        <div className="text-[10px] font-medium opacity-80 leading-none mb-1">
          Download on the
        </div>
        <div className="text-lg font-bold leading-none tracking-tight font-sans">
          App Store
        </div>
      </div>
    </Link>
  );
}

export function GooglePlayButton({ dark = false }: { dark?: boolean }) {
  return (
    <Link
      href="#"
      className={`inline-flex items-center justify-center rounded-xl border px-5 py-2.5 transition-all hover:scale-105 active:scale-95 duration-200 group ${
        dark
          ? "bg-black text-white border-white/20 shadow-lg shadow-black/20 hover:bg-zinc-900"
          : "bg-foreground text-background border-transparent shadow-xl hover:bg-foreground/90"
      }`}
    >
      <svg
        viewBox="0 0 512 512"
        width="22"
        height="22"
        className="mr-3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill="#00f076" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
        <path
          fill="#a6a6a6"
          d="M47.6 3.2L325.3 234.3l-60.1 60.1-248-189.2c-8.9-6.8-13.6-17.5-13.6-29.1 0-21.7 20.9-36.8 44-24.9z"
        />
        {/* Reverting to standard colorful Google Play Logo (Triangle) */}
        <path
          d="M32.02,24.16L197.76,197.16L24.3,371.74C19.78,367.62 16.94,361.64 16.94,354.89L16.94,22.42C16.94,14.07 20.91,6.8 26.94,2.42L32.02,24.16Z"
          fill="#2196F3"
        />
        <path
          d="M255.48,255.35L197.76,197.15L32.02,24.16L34.19,21.99C41.77,14.41 53.94,13.12 63.85,18.77L255.48,127.35L255.48,255.35Z"
          fill="#FFC107"
        />
        <path
          d="M255.48,255.34L309.28,309.15L363.3,255.34L309.28,201.53L255.48,255.34Z"
          fill="#4CAF50"
        />
        <path
          d="M197.76,313.53L255.48,255.34L383.56,327.92C373.65,333.58 361.48,332.28 353.9,324.7L32.02,486.53L197.76,313.53Z"
          fill="#F44336"
        />
        {/* Actually using a simpler standard paths for robustness if the above are complex. Let's use a known clean SVG string for Google Play logo */}
        <path
          d="M8.2,3.3C6.7,4.8,5.8,7.1,5.8,10.2v29.5c0,3.2,0.9,5.5,2.4,7l26.6-26.4L8.2,3.3z"
          fill="#2196F3"
        />
        <path
          d="M37.8,20.9L11.5,5.9c-1.2-0.7-2.7-0.7-3.3-0.1L34.8,23.9L37.8,20.9z"
          fill="#FFC107"
        />
        <path
          d="M37.8,29L34.8,26L8.2,52.8c0.6,0.5,2.1,0.6,3.3-0.1L37.8,29z"
          fill="#F44336"
        />
        <path
          d="M37.8,20.9L34.8,23.9l3,3c0.1-0.1,0.2-0.2,0.2-0.4v-2.2C38,21.1,37.9,21,37.8,20.9z"
          fill="#4CAF50"
        />
      </svg>
      <div className="text-left">
        <div className="text-[10px] font-medium opacity-80 leading-none mb-1">
          GET IT ON
        </div>
        <div className="text-lg font-bold leading-none tracking-tight font-sans">
          Google Play
        </div>
      </div>
    </Link>
  );
}

export function StoreButtons({ centered = false, dark = false }) {
  return (
    <div
      className={`flex flex-wrap gap-4 ${centered ? "justify-center" : ""} pt-8`}
    >
      {/* We force dark mode styles here for high contrast if not specified otherwise, or adhere to the prop */}
      <AppleStoreButton dark={dark} />
      <GooglePlayButton dark={dark} />
    </div>
  );
}
