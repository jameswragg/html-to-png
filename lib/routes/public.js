module.exports = {
  method: "get",
  path: "/public/{p*}",
  handler: {
    directory: {
      path: "public",
    },
  },
};
