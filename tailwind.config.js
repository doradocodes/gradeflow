// tailwind.config.js
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",   // Next.js App Router
        "./pages/**/*.{js,ts,jsx,tsx}", // (if you use /pages dir too)
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-dm-sans)", "sans-serif"], // 👈 DM Sans as default
            },
        },
    },
    plugins: [],
};
