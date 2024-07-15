/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./index.html",
    "./node_modules/flowbite-react/lib/**/*.{js,ts}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },  
    colors: {
      primary: {
        50: "#16161a",
        60: "#202124",
        150: "#4a4a4a",
        180: "#1c1c20",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a",
      },
      fuchsia: {
        50: '#fdf2ff',
        100: '#fce8ff',
        200: '#fad1ff',
        300: '#f8b4ff',
        400: '#f17bff',
        500: '#ec16f3',
        600: '#cb14d8',
        700: '#a812b6',
        800: '#891096',
        900: '#700b88',
      },
      sky: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      cyan: {
        50: '#e0f7fa',
        100: '#b2ebf2',
        200: '#80deea',
        300: '#4dd0e1',
        400: '#26c6da',
        500: '#00bcd4',
        600: '#00acc1',
        700: '#0097a7',
        800: '#00838f',
        900: '#006064',
      },
      custom:{
        50:'#A05AFF',
        100: "#1BCFB4", //green
        150:'#4BCBEB', // blue
        200:'#FE9496', // pink
        250:'#9E5AFF', //purple
        300:'#FF0044', //strong red
        400: '#1D232C', // new deep blue dark black
        500: '#161B21' //secondary blue black
      }
    },
    fontFamily: {
      display: ['Inter', ...defaultTheme.fontFamily.sans],
      body: ['Inter', ...defaultTheme.fontFamily.sans],
      serif: ['Inter', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
    },
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      body: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "system-ui",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
  },
  plugins: [require("flowbite/plugin")],
};
