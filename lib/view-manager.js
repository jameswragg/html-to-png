import Nunjucks from 'nunjucks';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const viewsManager = (server) => {
  console.log('hi', __dirname);

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
    path: [path.join(__dirname, './templates')],
    isCached: false,
  };
};
