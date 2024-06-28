import { ONE_DAY, ONE_MINUTE } from "./helpers/constants.mjs";

export default {
  method: async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.text();
  },
  options: {
    cache: {
      cache: "in-memory",
      expiresIn: ONE_DAY,
      staleIn: ONE_MINUTE * 30,
      staleTimeout: 100,
      generateTimeout: 5000,
      pendingGenerateTimeout: 5000, // how long to block subsequent stale refresh requests for
    },
  },
};
