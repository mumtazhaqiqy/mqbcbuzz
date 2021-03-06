import fastify from 'fastify';
import pointOfView from 'point-of-view';
import fastifyStatic from 'fastify-static';

import socketIo, { Socket } from 'socket.io';
import { logger } from './providers/logger';
import { registerRoutes } from './routes/views';
import config from './config';
import { IoEvent } from './enums/socketio';
import { Data } from './data';
import path from 'path';
import { User } from "./data/user";

const data = new Data();
const server = fastify({ logger: logger });
const io = socketIo(server.server);

server.register(registerRoutes, { data, config: config.application });
server.register(pointOfView, {
  engine: {
    ejs: require('ejs'),
    production: false
  },
});
logger.debug(path.join(__dirname, 'public'));
server.register(fastifyStatic, {
  root: path.join(__dirname, '..', 'public'),
});

io.on(IoEvent.CONNECTION, (socket: Socket) => {
  io.emit(IoEvent.SCORE.CHANGE, data.getData().teams);
  // On player join the game
  socket.on(IoEvent.PLAYER.NEW, (user: { id: string; name: string; team: string; }) => {
    const u = new User(user.id, user.name)
    data.addUser(u, user.team);
    // trigger player change to reload teams for other player
    io.emit(IoEvent.PLAYER.CHANGE, data.getData().teams);
    // trigger score change to reload score for other player if new player is in a new team
    io.emit(IoEvent.SCORE.CHANGE, data.getData().teams);
    logger.info(`New user ${user.name} joined the game!`);
    console.log(data);
  });

  // On Host add new team
  socket.on(IoEvent.PLAYER.NEWTEAM, (team: {teamName:string}) => {
    console.log(data.getTeams().length);
    if(data.getTeams().length < 6) {
      data.addTeam(team.teamName);
      // trigger player change to reload teams for other player
      io.emit(IoEvent.PLAYER.CHANGE, data.getData().teams);
      //trigger score change
      io.emit(IoEvent.SCORE.CHANGE, data.getData().teams);
      logger.info(`add new team ${team.teamName}`);
    } else {
      logger.info('cant process, teams more than 6');
    }
  });

  // On Host kick a player
  socket.on(IoEvent.PLAYER.KICK, (user: { id: string, team: string }) => {
    data.removeUser(user.id, user.team);
    // trigger player change to reload teams for other player
    io.emit(IoEvent.PLAYER.CHANGE, data.getData().teams);
    // trigger score change to reload score for other player if new player is in a new team
    io.emit(IoEvent.SCORE.CHANGE, data.getData().teams);
    // trigger kicked player buzz page to reload 
    io.emit(IoEvent.PLAYER.KICKED, user.id);
  })

  // On player quit the game
  socket.on(IoEvent.PLAYER.EXIT, (user: { id: string; name: string; team: string; }) => {
    data.removeUser(user.id, user.team);
    // data.removeEmptyTeams();
    // trigger player change to reload teams for other player
    io.emit(IoEvent.PLAYER.CHANGE, data.getData().teams);
    // trigger score change to reload score for other player if new player is in a new team
    io.emit(IoEvent.SCORE.CHANGE, data.getData().teams);
  })

  // On player buzz
  socket.on(IoEvent.BUZZ.NEW, (user: { id: string; name: string; team: string; }) => {
    data.buzzes.add(user.id);
    const date = new Date().getTime();
    const now = date;
    data.milis.add(now);
    io.emit(IoEvent.PLAYER.BUZZED, data.getBuzzes());
    // logger.info(`${user.name} buzzed in! at  ${now}` );
    console.log(data.getBuzzes());
  });

  // When host click the lock button
  socket.on(IoEvent.BUZZ.LOCK,() => {
    io.emit(IoEvent.BUZZ.LOCKED)
    logger.info('Buzz Locked');
  });

  // When host click the unlock button
  socket.on(IoEvent.BUZZ.UNLOCK,() => {
    io.emit(IoEvent.BUZZ.UNLOCKED)
    logger.info('Buzz unlocked');
  });

  // When host clear all buzzes
  socket.on(IoEvent.BUZZ.CLEAR, () => {
    data.resetBuzzes();
    io.emit(IoEvent.BUZZ.CLEARED, data.getBuzzes());
    io.emit(IoEvent.PLAYER.BUZZED, data.getBuzzes());
    logger.info('Clear buzzes');
  });

  // when host reset the game
  socket.on(IoEvent.BUZZ.RESET,() => {
    data.resetAll();
    io.emit(IoEvent.BUZZ.RESETED);
    io.emit(IoEvent.BUZZ.CLEARED, data.getBuzzes());
    io.emit(IoEvent.PLAYER.BUZZED, data.getBuzzes());
    logger.info('Reset buzzes');
  });

  socket.on(IoEvent.SCORE.INC, (team_name: string) => {
    logger.info(`Team ${team_name} gain a point`)
    data.incrementPoint(team_name);
    io.emit(IoEvent.SCORE.CHANGE, data.getData().teams);
  })

  socket.on(IoEvent.SCORE.DEC, (team_name: string) => {
    logger.info(`Team ${team_name} lose a point`)
    data.decrementPoint(team_name);
    io.emit(IoEvent.SCORE.CHANGE, data.getData().teams);
  });

  socket.on(IoEvent.SCORE.INC50, (team_name: string) => {
    logger.info(`Team ${team_name} gain half point`)
    data.increment50Point(team_name);
    io.emit(IoEvent.SCORE.CHANGE, data.getData().teams);
  });

  socket.on(IoEvent.SCORE.DEC50, (team_name: string) => {
    logger.info(`Team ${team_name} lose half point`)
    data.decrement50Point(team_name);
    io.emit(IoEvent.SCORE.CHANGE, data.getData().teams);
  });

  socket.on('disconnect', (reason) => {
    console.log(reason);
  });
});

const start = async () => {
  try {
    await server.listen(config.server.port, config.server.address);
  } catch (err) {
    logger.info(err);
    process.exit(1);
  }
};

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
  logger.error('UncaughException: ', error);
});
process.on('unhandledRejection', reason => {
  logger.error('UnhandledRejection: ', reason);
});

start().then(_ => logger.info(`Server listening on ${config.server.port}`));
