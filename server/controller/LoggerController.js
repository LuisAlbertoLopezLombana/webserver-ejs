const Service = require("typedi").Service;
const LoggerService = require("../testObjectsDI/LoggerService");

// LoggerManager,
// LoggerRepository,
// LoggerService,
// LoggerQueryBuilder
exports.LoggerController = Service([
    LoggerService
], (logger) => {
    return { logger };
});