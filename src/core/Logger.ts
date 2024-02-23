import loglevel from "loglevel";
import { inject, injectable } from "tsyringe";
import Tokens from "../bin/Tokens";

@injectable()
class Logger {
  private readonly logLevel: loglevel.RootLogger;

  constructor(@inject(Tokens.logLevel) logLevelLogger: loglevel.RootLogger) {
    this.logLevel = logLevelLogger;
  }

  info(message: string) {
    this.logLevel.info(message);
  }

  debug(message: string) {
    this.logLevel.debug(message);
  }

  warn(message: string) {
    this.logLevel.warn(message);
  }

  error(e: Error) {
    this.logLevel.error(e.message, e.stack);
  }

  seperate() {
    this.logLevel.debug(
      `--------------------------------------------`
    );
  }
}

export default Logger;
