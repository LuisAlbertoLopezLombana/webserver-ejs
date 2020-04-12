const morgan = require('morgan');

morgan.token('id', (req) => {
    return req.id
});

let loggerFormat = ':id [:date[web]] ":method :url" :status :response-time';

let middleStatusCodeStdErr = () => {
    return morgan(loggerFormat, {
        skip: (req, res) => {
            return res.statusCode < 400
        },
        stream: process.stderr
    })
}

let middleStatusCodeStdOut = () => {
    return morgan(loggerFormat, {
        skip: (req, res) => {
            return res.statusCode >= 400
        },
        stream: process.stdout
    })
}

module.exports = {
    middleStatusCodeStdErr,
    middleStatusCodeStdOut
}