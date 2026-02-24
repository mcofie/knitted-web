import React from 'react';

export const TailorHeroIllustration = () => (
    <svg
        width="400"
        height="300"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[400px] h-auto mx-auto mb-8"
    >
        {/* Tailor Form / Mannequin */}
        <path
            d="M200 60C200 60 180 80 180 110C180 140 190 180 185 220H215C210 180 220 140 220 110C220 80 200 60 200 60Z"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M200 120C185 130 180 150 180 170"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <path
            d="M200 120C215 130 220 150 220 170"
            stroke="#1a1a1a"
            strokeWidth="1.5"
            strokeLinecap="round"
        />

        {/* Measuring Tape wrapping around */}
        <path
            d="M175 135C175 135 200 145 225 135L240 180C240 180 210 195 180 185L175 135Z"
            stroke="#1a1a1a"
            strokeWidth="1.2"
            strokeDasharray="4 2"
        />

        {/* Accent detail: Pink Pin or thread */}
        <circle cx="215" cy="150" r="3" fill="#ff4d94" />
        <path
            d="M215 150L225 170"
            stroke="#ff4d94"
            strokeWidth="1"
        />

        {/* Abstract wavy lines for fabric motion */}
        <path
            d="M140 220C160 210 240 230 260 220"
            stroke="#1a1a1a"
            strokeWidth="1"
            opacity="0.3"
        />
        <path
            d="M150 240C180 235 220 250 250 240"
            stroke="#1a1a1a"
            strokeWidth="1"
            opacity="0.2"
        />

        {/* Some birds or abstract dots around like in Opennote */}
        <path d="M120 80C125 78 130 82 135 80" stroke="#1a1a1a" strokeWidth="1" />
        <path d="M110 95C115 93 120 97 125 95" stroke="#1a1a1a" strokeWidth="1" />
        <path d="M280 70C285 68 290 72 295 70" stroke="#1a1a1a" strokeWidth="1" />
    </svg>
);

export const ScrapsIllustration = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20C15 15 25 25 30 20" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
        <path d="M40 45C45 40 55 50 50 55" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round" />
        <circle cx="15" cy="45" r="2" fill="#ff4d94" opacity="0.5" />
    </svg>
);
