"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = (server, opts, done) => {
    server.get('/host', (request, reply) => {
        reply.view('/src/views/host.ejs', { config: opts.config, data: opts.data.getData() });
    });
    server.get('/', (request, reply) => {
        reply.view('/src/views/play.ejs', { config: opts.config, data: opts.data.getData() });
    });
    server.get('/scoreboard', (request, reply) => {
        reply.view('/src/views/scoreboard.ejs', { config: opts.config, data: opts.data.getData() });
    });
    done();
};
//# sourceMappingURL=views.js.map