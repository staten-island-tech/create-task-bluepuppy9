/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#94A3B8", // Grayish color
        secondary: "#E5E7EB", // Light gray
        accent: "#CBD5E1", // Border color
      },
      spacing: {
        // Custom spacing units to replace hardcoded pixels
        "1/4": "25%",
        "1/2": "50%",
        "1/3": "33%",
        "3/4": "75%",
        full: "100%",
      },
      borderRadius: {
        // Custom border radius to replace pixel values
        sm: "4px",
        md: "6px",
        lg: "16px",
        xl: "24px",
      },
      fontSize: {
        // Custom font sizes for better flexibility
        sm: ["14px", "1.5rem"],
        md: ["16px", "1.75rem"],
        lg: ["20px", "2rem"],
      },
    },
  },
  plugins: [require("daisyui")],
};
