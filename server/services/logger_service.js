const bunyan = require('bunyan')
const path = require('path');

class LoggerService {

    constructor(route) {
        this.route = route
        const logger = bunyan.createLogger({
            name: 'transaction-notifier-historias-clinicas',
            serializers: {
                req: require('bunyan-express-serializer'),
                res: bunyan.stdSerializers.res,
                err: bunyan.stdSerializers.err
            },
            streams: [{
                    level: 'info',
                    path: path.join(__dirname, `/../logs/${route}-info.log`),
                    period: '1d',
                    count: 3
                },
                {
                    level: 'error',
                    path: path.join(__dirname, `/../logs/${route}-error.log`)

                }
            ]

        });
        this.logger = logger
    }

    async info(message) {
        this.logger.info('info', message);
    }
    async info(message, obj) {
        this.logger.info('info', message, {
            obj
        })
    }
    async warn(message) {
        this.logger.warn('warn', message);
    }
    async warn(message, obj) {
        this.logger.warn('warn', message, {
            obj
        })
    }
    async error(message) {
        this.logger.error('error', message);
    }
    async error(message, obj) {
        this.logger.error('error', message, {
            obj
        })
    }

    /**
     * Event Control
     */

    logRequest = (req) => {
        let log = this.logger.child({
            id: req.id,
            body: req.body
        }, true)
        log.info({ req })
    }

    requestMid = () => {
        return (req, res, next) => {
            this.logRequest(req);
            next();
        };
    }

    logResponse = (id, body, statusCode) => {
        let log = this.logger.child({ id, body, statusCode }, true)
        log.info('response')
    }

    logAfterResponse = (id, res) => {
        let log = this.logger.child({ id }, true)
        log.info({ res }, 'response')
    }

    afterResponseMid = () => {
        return (req, res, next) => {
            let afterResponse = () => {
                res.removeListener('finish', afterResponse);
                res.removeListener('close', afterResponse);
                this.logAfterResponse(req.id, res);
            };
            res.on('finish', afterResponse);
            res.on('close', afterResponse);
            next();
        };
    }

}

module.exports = LoggerService