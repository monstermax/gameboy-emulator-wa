export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'hsl(var(--color-primary))',
                    foreground: 'hsl(var(--color-primary-foreground))',
                },
                background: 'hsl(var(--color-background))',
                foreground: 'hsl(var(--color-foreground))',
                border: 'hsl(var(--color-border))',
                card: 'hsl(var(--color-card))',
                muted: 'hsl(var(--color-muted))',
            },
            fontFamily: {
                sans: ['"DM Sans"', 'sans-serif'],
                body: ['"Inter"', 'sans-serif'],
            },
            borderRadius: {
                lg: '8px',
                md: '4px',
                sm: '2px',
            },
        },
    },
    plugins: [],
};
