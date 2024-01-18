import { Montserrat, Mulish } from "next/font/google";

export const nextFont = Mulish({
  weight: ["400", "600"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-google",
});
export const nextFontBold = Montserrat({
  weight: ["900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-google-bold",
});
