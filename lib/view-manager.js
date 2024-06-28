const Nunjucks = require("nunjucks");
const path = require("path");

module.exports = viewsManager = (server) => {
  return {
    engines: {
      njk: {
        compile: (src, options) => {
          const template = Nunjucks.compile(
            src,
            options.environment,
            options.filename
          );

          return (context) => {
            return template.render(context);
          };
        },

        prepare: (options, next) => {
          const env = Nunjucks.configure(options.path, {
            watch: false,
          });

          // pass nunjucks env for use in Vision
          options.compileOptions.environment = env;

          return next();
        },
      },
    },
    path: [path.join(__dirname, "./templates")],
    isCached: false,
  };
};
