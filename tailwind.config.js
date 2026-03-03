/** @type {import('tailwindcss').Config} */
export default {
    content: ['./**/*.html', './src/**/*.{js,ts}'],
    theme: {
        extend: {
            /* ─── Brand Colors (DataInventory.txt) ─── */
            colors: {
                surface: '#000000',       // Primary background — pure black
                card: '#0A0A0A',          // Elevated card / section backgrounds
                primary: '#FFFFFF',       // Headlines, high-priority text
                muted: '#A1A1A1',         // Subtext, labels, body paragraphs
                border: '#1A1A1A',        // Subtle dividers & grid lines
                glass: 'rgba(255, 255, 255, 0.05)',       // Glass fill
                'glass-border': 'rgba(255, 255, 255, 0.08)', // Glass borders
            },

            /* ─── Typography (DataInventory.txt + MasterTask.txt) ─── */
            fontFamily: {
                heading: ['"Wasted"', '"Syne"', 'sans-serif'],
                body: ['"Inter"', 'system-ui', 'sans-serif'],
                mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace'],
            },

            /* ─── Custom Spacing / Sizing ─── */
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },

            /* ─── Glass-blur value ─── */
            backdropBlur: {
                glass: '12px',
            },

            /* ─── Animations ─── */
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'marquee': {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
                'marquee': 'marquee 30s linear infinite',
            },
        },
    },
    plugins: [],
};
