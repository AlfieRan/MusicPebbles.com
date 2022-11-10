/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    mode: "jit",
    theme: {
        extend: {
            boxShadow: {
                outline: "0 0 12px rgba(0, 0, 0, 0.3)",
            },
        },
    },
    plugins: [],
};
