/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'image': 'url("/img/bg.svg")',
        'brand-bg-gradient': 'linear-gradient(0deg, #000829 2.05%, rgba(0, 8, 41, 0.991615) 5.23%, rgba(0, 8, 40, 0.967585) 7.82%, rgba(0, 7, 38, 0.9296) 9.91%, rgba(0, 7, 36, 0.879348) 11.59%, rgba(0, 7, 34, 0.818519) 12.95%, rgba(0, 6, 31, 0.7488) 14.08%, rgba(0, 5, 28, 0.671881) 15.08%, rgba(0, 5, 24, 0.589452) 16.02%, rgba(0, 4, 21, 0.5032) 17.02%, rgba(0, 3, 17, 0.414815) 18.15%, rgba(0, 3, 13, 0.325985) 19.51%, rgba(0, 2, 10, 0.2384) 21.19%, rgba(0, 1, 6, 0.153748) 23.28%, rgba(0, 1, 3, 0.0737185) 25.87%, rgba(0, 0, 0, 0) 29.05%), radial-gradient(29.44% 56% at 62.71% 51.84%, rgba(0, 8, 41, 0) 0%, rgba(0, 8, 41, 0.4) 100%)'
      },
      colors: {
        'brand-dark-blue': '#171E3B',
        'brand-blue-black': '#000829',
        'brand-dark-gray': '#2F3333',
        'brand-gray': '#B3BABA',
      }
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#020DE0",
        },
      }
    ]
  },
  plugins: [require("daisyui")],
}
