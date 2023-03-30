import { LogType } from './Enums/LogType';
import { LogTypeHelper } from './Enums/LogTypeHelper';
import DataProvider from '../Providers/DataProvider';
import { FileType } from '../Resolvers/Enums/FileType';

export default class Logger {
  private static logList: string[] = [];

  public async Log(type: LogType, error: string) {
    Logger.logList.push(
      `${new Date().toLocaleDateString()} [${type}]: ${error}`,
    );
    Logger.Stdout(type, Logger.logList.slice(-1)[0]);

    this.Write();
  }

  private async Write() {
    DataProvider.Create(FileType.LOG, { Data: Logger.logList.join('\n') });
  }

  private static Stdout(type: LogType, message: string) {
    process.stdout.write(`${LogTypeHelper.Color(type)}${message}\x1b[0m`);
  }
}
