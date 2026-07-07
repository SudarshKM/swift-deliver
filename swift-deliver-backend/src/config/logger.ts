import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const logger = pino({
  level: isProduction ? 'info' : 'debug',
  ...(!isProduction && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
});

// Child loggers for each subsystem
export const dbLogger = logger.child({ module: 'db' });
export const redisLogger = logger.child({ module: 'redis' });
export const workerLogger = logger.child({ module: 'worker' });
export const queueLogger = logger.child({ module: 'queue' });

export default logger;
