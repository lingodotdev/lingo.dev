import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,

    // OPTIONAL: enable (and require) email verification
    // await authClient.sendVerificationEmail({ email: "test@example.com" });
    // requireEmailVerification: true,
    // sendVerificationEmail: async ( { user, url, token }, request) => {
    //   console.log(
    //     "Sending verification email to",
    //     user.email,
    //     "with url",
    //     url
    //   );
    // },

    // OPTIONAL: enable password reset via email
    // await authClient.requestPasswordReset({ email: "test@example.com" });
    // sendResetPassword: async (url, user) => {
    //   console.log(
    //     "Sending reset password email to",
    //     user.email,
    //     "with url",
    //     url
    //   );
    // },
  },
});
