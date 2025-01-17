import winston from "winston";
import config from "./config";

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

export const logger = winston.createLogger({
  // This means that in development all logs will be printed to the console, while in other environments
  // only logs from http and below are logged.
  level: config.NODE_ENV === "development" ? "debug" : "http",
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.NODE_ENV === "development"
      ? winston.format.colorize()
      : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [new winston.transports.Console()],
});
