const rotateY = function ({ addUtilities }) {
    addUtilities({
        ".rotate-y-180": {
            transform: "rotateY(180deg)",
        },
    });
};

const bgSize = function ({ addUtilities }) {
    addUtilities({
        ".bg-size-400": {
            "background-size": "400% 400%",
        },
    });
};

module.exports = {
    content: ["./src/renderer/**/*.{js,jsx,ts,tsx}"],
    theme: {},
    variants: {},
    plugins: [rotateY, bgSize],
};
