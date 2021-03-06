"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IoEvent = {
    CONNECTION: 'connection',
    BUZZ: {
        NEW: 'buzz:new',
        CLEAR: 'buzz:clear',
        CLEARED: 'buzz:cleared',
        RESET: 'buzz:reset',
        RESETED: 'buzz:reseted'
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
        CHANGE: 'player:change',
        BUZZED: 'player:buzzed',
    }
};
//# sourceMappingURL=socketio.js.map