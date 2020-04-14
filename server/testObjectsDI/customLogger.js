const pino = require('pino')

let createLogger = (name, streams) => {
    return require('pino-http')({
        // Reuse an existing logger instance. Include multistream
        logger: pino({ name }, streams(name)),

        // Define a custom request id function
        genReqId: function(req) { return req.id },

        // Define custom serializers
        serializers: {
            err: pino.stdSerializers.err,
            req: pino.stdSerializers.req,
            res: pino.stdSerializers.res
        },

        // Define a custom logger level
        customLogLevel: function(res, err) {
            if (res.statusCode >= 400 && res.statusCode < 500) {
                return 'warn'
            } else if (res.statusCode >= 500 || err) {
                return 'error'
            }
            return 'info'
        },

        // Define a custom success message
        customSuccessMessage: function(res) {
            if (res.statusCode === 404) {
                return 'resource not found'
            }
            return 'request completed'
        },

        // Define a custom error message
        customErrorMessage: function(error, res) {
            return 'request errored with status code: ' + res.statusCode
        },

        // Override attribute keys for the log object
        customAttributeKeys: {
            req: 'request',
            res: 'response',
            err: 'error',
            responseTime: 'timeTaken'
        }
    })
};

module.exports = createLogger