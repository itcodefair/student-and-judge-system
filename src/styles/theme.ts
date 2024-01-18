import { MantineColorsTuple, createTheme } from "@mantine/core";

const cduPrimary: MantineColorsTuple = [
  "#f2f0fa",
  "#e0dcef",
  "#c0b5e0",
  "#9d8bd2",
  "#7f68c6",
  "#6d52bf",
  "#211645",
  "#6347bd",
  "#5339a6",
  "#4a3295",
];

const cduRed: MantineColorsTuple = [
  "#ffebf0",
  "#f9d6db",
  "#f0a9b4",
  "#e87b8c",
  "#e15469",
  "#dd3b54",
  "#dc2e48",
  "#c3223a",
  "#A71930",
  "#9a0e29",
];

const cduBrown: MantineColorsTuple = [
  "#f9f1f3",
  "#ecdfe3",
  "#dabcc5",
  "#ca96a6",
  "#bc758b",
  "#b36179",
  "#b05671",
  "#9b4760",
  "#8b3e55",
  "#7b3349",
];

const cduTeal: MantineColorsTuple = [
  "#eefafb",
  "#dff1f4",
  "#b9e5e9",
  "#91d7df",
  "#72cbd6",
  "#60c5d1",
  "#007A87",
  "#45a9b7",
  "#3897a3",
  "#1f838f",
];

const cduYellow: MantineColorsTuple = [
  "#fff8e1",
  "#fdefcd",
  "#f8dea1",
  "#f3cc70",
  "#EFBD47",
  "#edb32a",
  "#ebae1a",
  "#d29809",
  "#ba8700",
  "#a27300",
];

const cduBlue: MantineColorsTuple = [
  "#e6f7ff",
  "#d5ebf9",
  "#A0CFEB",
  "#81bfe3",
  "#5eabda",
  "#479fd5",
  "#3898d3",
  "#2784bb",
  "#1975a8",
  "#006696",
];

const cduGreen: MantineColorsTuple = [
  "#e7fdf0",
  "#d7f4e4",
  "#b2e6ca",
  "#8bd7ad",
  "#72CE9B",
  "#54c385",
  "#47c07d",
  "#36a86b",
  "#2b965d",
  "#18834d",
];

const cduOrange: MantineColorsTuple = [
  "#fff0e7",
  "#fce1d3",
  "#f5c2a6",
  "#eea076",
  "#e9844d",
  "#D55C19",
  "#e67232",
  "#e46824",
  "#b54d12",
  "#9f4009",
];

const cduColors = {
  cduBlue,
  cduBrown,
  cduGreen,
  cduOrange,
  cduPrimary,
  cduRed,
  cduTeal,
  cduYellow,
};

const theme = createTheme({
  /** Put your mantine theme override here */
  fontFamily: "Mulish,Roboto,sans-serif",
  colors: { ...cduColors },
  primaryColor: "cduOrange",
  autoContrast: true,
  // components: {},
});

export { theme };
