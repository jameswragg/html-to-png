"use strict";

module.exports = {
  method: "get",
  path: "/favicon.ico",
  options: {
    handler: async (request, h) => {
      return h.file("public/favicon.ico");
    },
  },
};
