export const IoEvent = {
  CONNECTION: 'connection',
  BUZZ: {
    NEW: 'buzz:new',
    CLEAR: 'buzz:clear',
    CLEARED: 'buzz:cleared',
    RESET: 'buzz:reset',
    RESETED: 'buzz:reseted',
    LOCK: 'buzz:lock',
    LOCKED: 'buzz:locked',
    UNLOCK: 'buzz:unlock',
    UNLOCKED: 'buzz:unlocked'
  },
  SCORE: {
    INC: 'score:inc',
    DEC: 'score:dec',
    INC50: 'score:inc50',
    DEC50: 'score:dec50',
    CHANGE: 'score:change'
  },
  PLAYER: {
    NEW: 'player:new',
    NEWTEAM: 'player:newteam',
    EXIT: 'player:exit',
    KICK: 'player:kick',
    KICKED: 'player:kicked',
    CHANGE: 'player:change',
    BUZZED: 'player:buzzed',
  }
}
