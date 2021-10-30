"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const point_of_view_1 = __importDefault(require("point-of-view"));
const fastify_static_1 = __importDefault(require("fastify-static"));
const socket_io_1 = __importDefault(require("socket.io"));
const logger_1 = require("./providers/logger");
const views_1 = require("./routes/views");
const config_1 = __importDefault(require("./config"));
const socketio_1 = require("./enums/socketio");
const data_1 = require("./data");
const path_1 = __importDefault(require("path"));
const user_1 = require("./data/user");
const data = new data_1.Data();
const server = fastify_1.default({ logger: logger_1.logger });
const io = socket_io_1.default(server.server);
server.register(views_1.registerRoutes, { data, config: config_1.default.application });
server.register(point_of_view_1.default, {
    engine: {
        ejs: require('ejs'),
        production: false
    },
});
logger_1.logger.debug(path_1.default.join(__dirname, 'public'));
server.register(fastify_static_1.default, {
    root: path_1.default.join(__dirname, '..', 'public'),
});
io.on(socketio_1.IoEvent.CONNECTION, (socket) => {
    io.emit(socketio_1.IoEvent.SCORE.CHANGE, data.getData().teams);
    // On player join the game
    socket.on(socketio_1.IoEvent.PLAYER.NEW, (user) => {
        const u = new user_1.User(user.id, user.name);
        data.addUser(u, user.team);
        // trigger player change to reload teams for other player
        io.emit(socketio_1.IoEvent.PLAYER.CHANGE, data.getData().teams);
        // trigger score change to reload score for other player if new player is in a new team
        io.emit(socketio_1.IoEvent.SCORE.CHANGE, data.getData().teams);
        logger_1.logger.info(`New user ${user.name} joined the game!`);
        console.log(data);
    });
    // On Host add new team
    socket.on(socketio_1.IoEvent.PLAYER.NEWTEAM, (team) => {
        data.addTeam(team.teamName);
        // trigger player change to reload teams for other player
        io.emit(socketio_1.IoEvent.PLAYER.CHANGE, data.getData().teams);
        //trigger score change
        io.emit(socketio_1.IoEvent.SCORE.CHANGE, data.getData().teams);
        logger_1.logger.info(`add new team ${team.teamName}`);
        console.log(data.getTeams());
    });
    // On player quit the game
    socket.on(socketio_1.IoEvent.PLAYER.EXIT, (user) => {
        data.removeUser(user.id, user.team);
        data.removeEmptyTeams();
        // trigger player change to reload teams for other player
        io.emit(socketio_1.IoEvent.PLAYER.CHANGE, data.getData().teams);
        // trigger score change to reload score for other player if new player is in a new team
        io.emit(socketio_1.IoEvent.SCORE.CHANGE, data.getData().teams);
    });
    // On player buzz
    socket.on(socketio_1.IoEvent.BUZZ.NEW, (user) => {
        data.buzzes.add(user.id);
        const date = new Date().getTime();
        const now = date;
        data.milis.add(now);
        io.emit(socketio_1.IoEvent.PLAYER.BUZZED, data.getBuzzes());
        // logger.info(`${user.name} buzzed in! at  ${now}` );
        console.log(data.getBuzzes());
    });
    // When host clear all buzzes
    socket.on(socketio_1.IoEvent.BUZZ.CLEAR, () => {
        data.resetBuzzes();
        io.emit(socketio_1.IoEvent.BUZZ.CLEARED, data.getBuzzes());
        io.emit(socketio_1.IoEvent.PLAYER.BUZZED, data.getBuzzes());
        logger_1.logger.info('Clear buzzes');
    });
    // when host reset the game
    socket.on(socketio_1.IoEvent.BUZZ.RESET, () => {
        data.resetAll();
        io.emit(socketio_1.IoEvent.BUZZ.RESETED);
        io.emit(socketio_1.IoEvent.BUZZ.CLEARED, data.getBuzzes());
        io.emit(socketio_1.IoEvent.PLAYER.BUZZED, data.getBuzzes());
        logger_1.logger.info('Reset buzzes');
    });
    socket.on(socketio_1.IoEvent.SCORE.INC, (team_name) => {
        logger_1.logger.info(`Team ${team_name} gain a point`);
        data.incrementPoint(team_name);
        io.emit(socketio_1.IoEvent.SCORE.CHANGE, data.getData().teams);
    });
    socket.on(socketio_1.IoEvent.SCORE.DEC, (team_name) => {
        logger_1.logger.info(`Team ${team_name} lose a point`);
        data.decrementPoint(team_name);
        io.emit(socketio_1.IoEvent.SCORE.CHANGE, data.getData().teams);
    });
    socket.on(socketio_1.IoEvent.SCORE.INC50, (team_name) => {
        logger_1.logger.info(`Team ${team_name} gain half point`);
        data.increment50Point(team_name);
        io.emit(socketio_1.IoEvent.SCORE.CHANGE, data.getData().teams);
    });
    socket.on(socketio_1.IoEvent.SCORE.DEC50, (team_name) => {
        logger_1.logger.info(`Team ${team_name} lose half point`);
        data.decrement50Point(team_name);
        io.emit(socketio_1.IoEvent.SCORE.CHANGE, data.getData().teams);
    });
    socket.on('disconnect', (reason) => {
        console.log(reason);
    });
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.listen(config_1.default.server.port, config_1.default.server.address);
    }
    catch (err) {
        logger_1.logger.info(err);
        process.exit(1);
    }
});
server.setNotFoundHandler((request, reply) => {
    server.log.debug('Route not found: ', request.req.url);
    reply.status(404).send({ message: 'Not found' });
});
server.setErrorHandler((error, request, reply) => {
    server.log.debug(`Request url: `, request.req.url);
    server.log.debug(`Payload: `, request.body);
    server.log.error(`Error occurred: `, error);
    reply.status(error.statusCode || 500).send({ message: error.message || 'Error occurred during request' });
});
process.on('uncaughtException', error => {
    logger_1.logger.error('UncaughException: ', error);
});
process.on('unhandledRejection', reason => {
    logger_1.logger.error('UnhandledRejection: ', reason);
});
start().then(_ => logger_1.logger.info(`Server listening on ${config_1.default.server.port}`));
//# sourceMappingURL=index.js.map