import winston from 'winston';

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.simple()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs.log' }),
    ],
});

export const loggerMiddleware = (req, res, next) => {
    logger.info('Request received', {
        method: req.method,
        url: req.originalUrl,
        params: req.params,
        query: req.query,
    });

    const originalSend = res.send;

    res.send = function (body) {
        logger.info('Response sent', {
            status: res.statusCode,
        });
        originalSend.call(this, body);
    };

    next();
};
