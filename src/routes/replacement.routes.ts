import type { FastifyInstance } from 'fastify';
import { ReplacementService } from '../services/replacement.service.js';
import { config } from '../config.js';
import type { JsonValue } from '../types/json.types.js';

export function replacementRoutes(fastify: FastifyInstance) {
  fastify.post('/replace', async (request, reply) => {
    const body = request.body as JsonValue;

    if (!body || typeof body !== 'object') {
      return reply.status(400).send({ error: 'A valid JSON payload is required.' });
    }

    // If we had a cache, we could do something like this to get O(1):
    // const cachedResult = cache.get(body);
    // if (cachedResult) {
    //   return reply.send(cachedResult);
    // }

    // If the response isn't needed right away, we could add it to a queue for processing and return a success message.

    // We create a new service instance for each request to ensure the limit is fresh.
    const service = new ReplacementService(config.replacementLimit);
    const result = service.replace(body);

    return reply.send(result);
  });
}
