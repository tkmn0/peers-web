/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import LogLevel from "./logLevel";

export default class LogHandler {
  private level: LogLevel = "off";

  constructor(level: LogLevel) {
    this.level = level;
  }

  public log = (tag: string, message: string, args: any[] | null = null) => {
    if (this.level === "debug") {
      console.log(`\u001b[42m[DEBUG] ${tag} - ${message}`, args == null ? "" : args);
    }
  };

  public error = (tag: string, message: string, args: any[] | null = null) => {
    if (this.level === "error") {
      console.error(`\u001b[41m[EROOR] ${tag} - ${message}`, args == null ? "" : args);
    }
  };

  public info = (tag: string, message: string, args: any[] | null = null) => {
    if (this.level === "info") {
      console.log(`\u001b[44m[INFO] ${tag} - ${message}`, args == null ? "" : args);
    }
  };
}
