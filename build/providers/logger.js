"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const config_1 = __importDefault(require("../config"));
exports.createLogger = () => pino_1.default({
    prettyPrint: config_1.default.logger.devMode,
    timestamp: false,
});
exports.logger = exports.createLogger();
//# sourceMappingURL=logger.js.map