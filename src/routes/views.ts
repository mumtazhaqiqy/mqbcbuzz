import * as fastify from 'fastify';
import { Data } from '../data';
import { IApplication } from '../config';

interface IOpts {
  data: Data;
  config: IApplication;
}

export const registerRoutes = (server: fastify.FastifyInstance, opts: IOpts, done: () => void) => {
  server.get('/host', (request, reply) => {
    reply.view('/src/views/host.ejs', { config: opts.config, data: opts.data.getData() });
  });
  server.get('/', (request, reply) => {
    reply.view('/src/views/play.ejs', { config: opts.config, data: opts.data.getData() });
  });
  server.get('/scoreboard', (request, reply) => {
    reply.view('/src/views/scoreboard.ejs', { config: opts.config, data: opts.data.getData() });
  });
  server.get('/scoreboard2', (request, reply) => {
    reply.view('/src/views/scoreboard2.ejs', { config: opts.config, data: opts.data.getData() });
  });
  server.get('/team/:id', (request, reply) => {
    reply.view('/src/views/team.ejs', { config: opts.config, data: opts.data.getData(), param: request.params.id});
    console.log(request.params.id)
  });
  done();
};