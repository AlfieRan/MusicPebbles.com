/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    mode: "jit",
    theme: {
        extend: {
            boxShadow: {
                outline: "0 0 12px rgba(0, 0, 0, 0.3)",
            },
            colors: {
                black: {
                    50: "#525252",
                    100: "#424242",
                    200: "#363636",
                    300: "#282828",
                    400: "#222",
                    500: "#141414",
                    600: "#0a0a0a",
                    700: "#000",
                },
            },
        },
    },
    plugins: [],
};
