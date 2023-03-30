import { LogType } from './LogType';
import { FgRed, FgWhite, FgYellow, FgGray } from '../utils/ConsoleColors';

export abstract class LogTypeHelper {
    public static Color(type: LogType): string {
        switch (type) {
            case LogType.Debug:
                return FgGray;
            case LogType.Info:
                return FgWhite;
            case LogType.Warn:
                return FgYellow;
            case LogType.Native:
                return FgGray;
            case LogType.Error:
                return FgRed;
            case LogType.Benchmark:
                return FgGray;
            default:
                throw new Error();
        }
    }
}
