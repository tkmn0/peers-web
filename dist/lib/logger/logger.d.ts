import LogHandler from "./logHanlder";
import LogLevel from "./logLevel";
export default class Logger {
    private static logLevel;
    static logger(): LogHandler;
    static setup(level: LogLevel): void;
}
