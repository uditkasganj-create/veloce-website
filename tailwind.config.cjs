/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./hooks/**/*.{js,ts,jsx,tsx}",
        "./context/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
                serif: ["Space Grotesk", "sans-serif"],
                mono: ["JetBrains Mono", "ui-monospace", "monospace"],
            },
            colors: {
                brand: {
                    black: "#16181D",
                    white: "#FAFAFA",
                    accent: "#D4AF37",
                    orange: "#D4AF37",
                    red: "#8B0000",
                    charcoal: "#13141B",
                },
            },
            boxShadow: {
                glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
                brand: "0 0 20px rgba(212, 175, 55, 0.4)",
                "brand-soft": "0 0 20px rgba(212, 175, 55, 0.2)",
            },
        },
    },
    plugins: [],
}
