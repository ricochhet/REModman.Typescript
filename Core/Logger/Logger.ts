import { LogType } from "./Enums/LogType";
import FsProvider from "../Providers/FsProvider"
import PathResolver from "../Resolvers/PathResolver"
import { LogTypeHelper } from "./Enums/LogTypeHelper";

export default class Logger {
    private static logList: string[] = []

    public async Log(type: LogType, error: string) {
        Logger.logList.push(`${new Date().toLocaleDateString()} [${type}]: ${error}`)
        Logger.Stdout(type, Logger.logList.slice(-1)[0])
        
        this.Write()
    }

    async Write() {
        FsProvider.EnsureDirectory(PathResolver.MOD_DIR)

        try {
            FsProvider.WriteFileSync(PathResolver.LOG_PATH, Logger.logList.join('\n'))
        } catch (e) { }
    }

    public static Stdout(type: LogType, message: string) {
        process.stdout.write(`${LogTypeHelper.Color(type)}${message}\x1b[0m`)
    }
}