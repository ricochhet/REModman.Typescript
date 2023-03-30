import path from 'path';
import { GameType } from '../enums/GameType';
import PathResolver from '../resolvers/PathResolver';
import { IsNullOrEmpty } from '../utils/IsNullOrEmpty';
import FsProvider from '../providers/generic/FsProvider';
import { ISettingsData } from '../interfaces/ISettingsData';

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
