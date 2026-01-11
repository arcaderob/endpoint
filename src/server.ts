import Fastify from 'fastify';
import { config } from './config.js';
import { replacementRoutes } from './routes/replacement.routes.js';

const server = Fastify({ 
  logger: true,
  bodyLimit: config.bodyLimit
});

server.register(replacementRoutes);

const start = async () => {
  try {
    await server.listen({ port: config.port, host: '0.0.0.0' });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

await start();
