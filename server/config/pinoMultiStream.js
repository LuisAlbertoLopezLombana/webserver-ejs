const pinoms = require('pino-multi-stream').multistream
const fs = require('fs')
const path = require('path');


var streams = (name) => {
    return pinoms([
        { stream: fs.createWriteStream(path.join(__dirname, `/../logs/${name}.info.stream.out`)) },
        { level: 'error', stream: fs.createWriteStream(path.join(__dirname, `/../logs/${name}.error.stream.out`)) },
        { level: 'fatal', stream: fs.createWriteStream(path.join(__dirname, `/../logs/${name}.fatal.stream.out`)) }
    ])
}

module.exports = streams