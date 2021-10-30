"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ENVIRONMENT;
(function (ENVIRONMENT) {
    ENVIRONMENT["PRODUCTION"] = "production";
    ENVIRONMENT["LOCAL"] = "local";
    ENVIRONMENT["PREPROD"] = "preprod";
    ENVIRONMENT["DEV"] = "development";
    ENVIRONMENT["TEST"] = "test";
})(ENVIRONMENT = exports.ENVIRONMENT || (exports.ENVIRONMENT = {}));
const config = {
    logger: {
        devMode: env('NODE_ENV', ENVIRONMENT.DEV) === ENVIRONMENT.LOCAL,
    },
    server: {
        address: env('HOST', '0.0.0.0'),
        port: int(env('PORT', '3000')),
        env: env('NODE_ENV', ENVIRONMENT.DEV),
    },
    application: {
        title: env('APPLICATION_TITLE', 'MQBC BCA'),
    },
};
exports.default = config;
function env(name, defaultValue) {
    return process.env[name] || defaultValue;
}
exports.env = env;
function int(value) {
    return value ? parseInt(value, 10) : undefined;
}
exports.int = int;
function array(value) {
    return value ? value.split(/, ?/) : undefined;
}
exports.array = array;
function boolean(value) {
    return value === 'true';
}
exports.boolean = boolean;
//# sourceMappingURL=config.js.map