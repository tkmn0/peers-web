import LogLevel from "./logLevel";
export default class LogHandler {
    private level;
    constructor(level: LogLevel);
    log: (tag: string, message: string, args?: any[] | null) => void;
    error: (tag: string, message: string, args?: any[] | null) => void;
    info: (tag: string, message: string, args?: any[] | null) => void;
}
