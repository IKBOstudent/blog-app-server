"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
exports.logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.File({ filename: 'logs.log' }),
    ],
});
const loggerMiddleware = (req, res, next) => {
    exports.logger.info({
        message: 'Request received',
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
        formdata: req.files,
    });
    const originalSend = res.send;
    res.send = function (body) {
        exports.logger.info({
            message: 'Response sent',
            status: res.statusCode,
            body: body,
        });
        originalSend.call(this, body);
    };
    next();
};
exports.loggerMiddleware = loggerMiddleware;
//# sourceMappingURL=loggerMiddleware.js.map