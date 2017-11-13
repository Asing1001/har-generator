const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');
const { ensureDir } = require('./util');

const getLogger = ({ logsFolder } = {}) => {
    logsFolder = logsFolder || path.join(path.dirname(require.main.filename), 'logs');
    ensureDir(logsFolder)
    const dailyRotateFile = new (winston.transports.DailyRotateFile)({
        filename: path.join(logsFolder, './log'),
        datePattern: 'yyyy-MM-dd.',
        prepend: true,
        json: false
    });

    const logger = new (winston.Logger)({
        transports: [
            dailyRotateFile,
            new winston.transports.Console({ colorize: true })
        ]
    });

    return logger;
}

const logger = getLogger()

module.exports = { logger, getLogger };