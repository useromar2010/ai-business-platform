import pino from 'pino';
import config from '@/config';

const isDevelopment = config.app.environment === 'development';

const logger = pino(
  {
    level: config.logging.level,
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            levelFirst: true,
            singleLine: false,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
  },
  isDevelopment ? process.stdout : process.stdout
);

export default logger;
