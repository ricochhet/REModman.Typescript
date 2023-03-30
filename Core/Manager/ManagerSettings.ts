import path from 'path';
import { GameType } from '../Enums/GameType';
import PathResolver from '../Resolvers/PathResolver';
import { IsNullOrEmpty } from '../Utils/IsNullOrEmpty';
import FsProvider from '../Providers/Generic/FsProvider';
import { ISettingsData } from '../Interfaces/ISettingsData';

export default abstract class ManagerSettings {
  public static Save(settings: ISettingsData) {
    const file: string = PathResolver.SETTINGS_PATH;

    FsProvider.EnsureDirectory(file);
    FsProvider.WriteFileSync(file, JSON.stringify(settings, null, 2));
  }

  public static Load(): ISettingsData {
    if (FsProvider.ExistsSync(PathResolver.DATA_PATH)) {
      const file: string = PathResolver.SETTINGS_PATH;

      if (FsProvider.ExistsSync(file)) {
        return <ISettingsData>(
          JSON.parse(FsProvider.ReadFileSync(file).toString())
        );
      }

      return <ISettingsData>{};
    }

    return <ISettingsData>{};
  }

  private static GetKeyValue(key: string, value: string): string {
    const settings: ISettingsData = ManagerSettings.Load();
    if (settings == null || IsNullOrEmpty(settings)) throw new Error();

    if (settings[key].has(value)) {
      return settings[key][value];
    }

    throw new Error();
  }

  public static GetGamePath(type: GameType): string {
    return path.dirname(
      ManagerSettings.GetKeyValue('GamePaths', type.toString()),
    );
  }
}
