import * as path from 'path';
import { createLogger, format, transports } from 'winston';
const { combine, printf, timestamp } = format;

export const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'medium' }).format() }),
    printf(({ timestamp, level, message }) => {
      return `${timestamp} [${path.relative(process.cwd(), __filename)}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    new transports.Console(),
  ],
});