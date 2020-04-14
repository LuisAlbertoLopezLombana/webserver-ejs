class LoggerService {

    constructor() {
        this.customLogger = null;
    }

    build(name, multistream) {
        this.customLogger = require('./customLogger')(name, multistream);
    }

    async info(message) {
        this.customLogger.logger.info('info', message);
    }
    async info(message, obj) {
        this.customLogger.logger.info('info', message, {
            obj
        })
    }
    async warn(message) {
        this.customLogger.logger.warn('warn', message);
    }
    async warn(message, obj) {
        this.customLogger.logger.warn('warn', message, {
            obj
        })
    }
    async error(message) {
        this.customLogger.logger.error('error', message);
    }
    async error(message, obj) {
        this.customLogger.logger.error('error', message, {
            obj
        })
    }

    logRequest = (req) => {
        let log = req.log.child({
            body: req.body
        }, true)
        log.info({ req })
    }

    requestMid = () => {
        return (req, res, next) => {
            this.customLogger(req, res)
            this.logRequest(req);
            next();
        };
    }

    logResponse = (req, body, statusCode) => {
        let log = req.log.child({ id: req.id, body, statusCode }, true)
        log.info('response')
    }

    logAfterResponse = (req, res) => {
        let log = req.log.child({ id: req.id }, true)
        log.info({ res }, 'logAfterResponse')
    }

    afterResponseMid = () => {
        return (req, res, next) => {
            let afterResponse = () => {
                res.removeListener('finish', afterResponse);
                res.removeListener('close', afterResponse);
                this.logAfterResponse(req, res);
            };
            res.on('finish', afterResponse);
            res.on('close', afterResponse);
            next();
        };
    }

}

module.exports = LoggerService