// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',      // if using Next.js /app
        './pages/**/*.{js,ts,jsx,tsx,mdx}',    // if using /pages
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                surface: 'hsl(var(--surface))',
                'surface-container': 'hsl(var(--surface-container))',
                'surface-container-low': 'hsl(var(--surface-container-low))',
                'surface-container-high': 'hsl(var(--surface-container-high))',
                'surface-container-highest': 'hsl(var(--surface-container-highest))',

                'on-surface': 'hsl(var(--on-surface))',
                'on-surface-variant': 'hsl(var(--on-surface-variant))',
                'outline-variant': 'hsl(var(--outline-variant))',

                primary: 'hsl(var(--primary))',
                'primary-foreground': 'hsl(var(--primary-foreground))',
                secondary: 'hsl(var(--secondary))',
                'secondary-foreground': 'hsl(var(--secondary-foreground))',
                tertiary: 'hsl(var(--tertiary))',
                error: 'hsl(var(--error))',
            },
        },
    },
    plugins: [],
} satisfies Config