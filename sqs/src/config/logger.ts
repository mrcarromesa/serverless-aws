import winston from 'winston';

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    alert: 3,
    error: 4,
    json: 5,
  },
  colors: {
    debug: 'grey',
    info: 'green',
    warn: 'yellow',
    alert: 'cyan',
    error: 'red',
    json: 'blue',
  },
};

const silent = process.env.DEBUG_SILENT === 'true';

const decoretorInit = process.env.STAGE === 'local' && '\x1b[35m';
const decoretorEnd = process.env.STAGE === 'local' && '\x1b[0m';

const loggerPrint = winston.createLogger({
  level: process.env.DEBUG_LEVEL || 'info',
  levels: config.levels,
  transports: [
    new winston.transports.Console({
      silent,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(info => {
          return `[${info.level}] : ${decoretorInit}${info.message}${decoretorEnd}`;
        }),
      ),
    }),
  ],
}) as winston.Logger &
  Record<keyof typeof config['levels'], winston.LeveledLogMethod>;

winston.addColors(config.colors);

const logger = (...args: unknown[]): void => {
  const parseArgs = args.map(arg => {
    try {
      return JSON.stringify(arg);
    } catch (err) {
      return 'Could not convert content from to the log';
    }
  });
  loggerPrint.info(parseArgs);
};

export { logger };
