export const IoEvent = {
  CONNECTION: 'connection',
  BUZZ: {
    NEW: 'buzz:new',
    CLEAR: 'buzz:clear',
    CLEARED: 'buzz:cleared',
    RESET: 'buzz:reset',
  },
  SCORE: {
    INC: 'score:inc',
    DEC: 'score:dec',
    CHANGE: 'score:change'
  },
  PLAYER: {
    NEW: 'player:new',
    NEWTEAM: 'player:newteam',
    EXIT: 'player:exit',
    CHANGE: 'player:change',
    BUZZED: 'player:buzzed',
  }
}
