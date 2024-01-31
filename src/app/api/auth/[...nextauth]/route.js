import NextAuth from "next-auth";
import { getMongoContainer } from "src/lib/getMongoContainer";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const USER_CONTAINER = process.env.USER_CONTAINER;

export const handler = NextAuth({
	name: "Credentials",
	session: {
		strategy: "jwt",
		maxAge: 60 * 60 * 24, // 24 hours
	},
	providers: [
		CredentialsProvider({
			async authorize(credentials) {
				try {
					container = await getMongoContainer(USER_CONTAINER);
					const user = await container.findOne({
						email: credentials.email,
					});

					if (!user) {
						return null;
					}

					const isPasswordMatch = await compare(
						credentials.password,
						user.password
					);
					if (!isPasswordMatch) {
						return null;
					}

					return user;
				} catch (error) {
					console.error("Error during authentication:", error);
					return null;
				}
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, user }) {
			// updateing token
			if (user) {
				token.Id = user._id;
				token.userType = user.userType;
				token.isVerified = user.isVerified;
			}
			return token;
		},
		async session({ session, token }) {
			// store the user id from MongoDB to session
			session.user.id = token._id.toString();
			session.user.type = token.userType.toString();
			session.user.verified = token.isVerified;

			return session;
		},
	},
	pages: {
		signIn: "/auth/signin",
		signOut: "/auth/signout",
	},
});

export { handler as GET, handler as POST };
