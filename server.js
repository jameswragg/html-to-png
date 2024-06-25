import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import Blipp from 'blipp';

const init = async () => {
  const server = await new Hapi.Server({
    host: 'localhost',
    port: 3000,
    debug: {
      log: ['*'],
    },
  });

  await server.register([Blipp, Inert, Vision]);

  const { viewsManager } = await import('./lib/view-manager.js');
  server.views(viewsManager(server));

  const { home } = await import('./lib/routes/home.js');
  server.route(home);

  try {
    await server.start();
    console.log('Server running at:', server.info.uri);
  } catch (err) {
    console.log(err);
  }
};

init();
