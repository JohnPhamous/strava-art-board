import winston from "winston";
const { format, transports } = winston;

const env = process.env.NODE_ENV;
const level = env === "prod" ? "error" : "debug";
const silent = env === "test";
const logger = winston.createLogger({
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD hh:mm:ss.SSS A" }),
    format.colorize(),
    format.simple(),
    format.printf(info => `${info.timestamp} - ${info.level}: ${info.message}`)
  ),
  silent,
  transports: [
    new transports.Console({
      level
    })
  ]
});

// Use this to output Morgan logs via Winston.
export class WinstonStream {
  write(message: string): void {
    logger.log({ message, level: "info" });
  }
}

export default logger;
