import NextAuth from "next-auth";
import authCongif from "./auth.congif";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  ...authCongif,
});
