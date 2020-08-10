import LogHandler from "./logHanlder";
import LogLevel from "./logLevel";

export default class Logger {
  private static logLevel: LogLevel = "off";

  public static logger() {
    const handler = new LogHandler(this.logLevel);
    return handler;
  }

  static setup(level: LogLevel) {
    this.logLevel = level;
  }
}
