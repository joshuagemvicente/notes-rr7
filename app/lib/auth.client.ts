import { createAuthClient } from "better-auth/react";

export const {
  signUp,
  signIn,
  signOut,
  forgetPassword,
  verifyEmail,
  resetPassword,
  changePassword,
} = createAuthClient({
  fetchOptions: {
    onError: async (context) => {
      const { response } = context;
      if (response.status === 429) {
        const retryAfter = response.headers.get("X-Retry-After");
        console.log(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
      }
    },
  },
});
