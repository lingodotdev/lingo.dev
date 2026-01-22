import { autumnHandler } from "autumn-js/next";
// import { auth } from "@/lib/auth";

export const { GET, POST } = autumnHandler({
  identify: async (/*request*/) => {
    // get the user from your auth provider (example: better-auth)
    // const session = await auth.api.getSession({
    //   headers: request.headers,
    // });

    return {
      customerId: "123",
      customerData: {
        name: "Custom Hack",
        email: "custom@hack.com",
      },
    };
  },
});
