import { REEngine } from '../patches/REEngine';
import { GameType } from '../enums/GameType';
import FsProvider from '../providers/generic/FsProvider';
import { IModData } from '../interfaces/IModData';
import ManagerSettings from './ManagerSettings';
import PathResolver from '../resolvers/PathResolver';
import { IsNullOrEmpty } from '../utils/IsNullOrEmpty';
import Cache from './ManagerCache';

export default abstract class ModInstaller {
    public static SetLoadOrder(
        type: GameType,
        identifier: string,
        order: number,
    ) {
        const list: Array<IModData> = Cache.Load(type);
        if (list.length == 0) throw new Error();

        const mod: IModData = Cache.Find(list, identifier);
        if (mod == null || IsNullOrEmpty(mod)) throw new Error();

        if (mod.LoadOrder == order) return;

        mod.LoadOrder = order;
        Cache.SaveAnyChanges(type, list);
    }

    public static GetLoadOrder(type: GameType, identifier: string): number {
        const list: Array<IModData> = Cache.Load(type);
        if (list.length == 0) throw new Error();

        const mod: IModData = Cache.Find(list, identifier);
        if (mod == null || IsNullOrEmpty(mod)) throw new Error();

        return mod.LoadOrder;
    }

    public static Enable(
        type: GameType,
        identifier: string,
        isEnabled: boolean,
    ) {
        let list: Array<IModData> = Cache.Load(type);
        if (list.length == 0) throw new Error();

        const mod: IModData = Cache.Find(list, identifier);
        if (mod == null || IsNullOrEmpty(mod)) throw new Error();

        if (mod.IsEnabled == isEnabled) return;

        mod.IsEnabled = isEnabled;
        const containsValidPaks: boolean = REEngine.HasValidPatchPaks(mod);

        if (isEnabled) {
            if (containsValidPaks) {
                list = REEngine.Patch(list);
            }

            ModInstaller.Install(type, mod);
        } else {
            ModInstaller.Uninstall(type, mod);

            if (containsValidPaks) {
                list = REEngine.Patch(list);
            }
        }

        Cache.SaveAnyChanges(type, list);
    }

    private static Install(type: GameType, mod: IModData) {
        if (FsProvider.ExistsSync(ManagerSettings.GetGamePath(type))) {
            mod.Files.forEach(file => {
                FsProvider.CopyFileSync(file.SourcePath, file.InstallPath);
            });
        }
    }

    private static Uninstall(type: GameType, mod: IModData) {
        if (FsProvider.ExistsSync(ManagerSettings.GetGamePath(type))) {
            mod.Files.forEach(file => {
                if (FsProvider.ExistsSync(file.InstallPath)) {
                    try {
                        FsProvider.RmSync(file.InstallPath, {});
                    } catch (e) {
                        const err: Error = <Error>e;
                        throw e;
                    }
                }
            });

            FsProvider.CleanEmptyDirectories(ManagerSettings.GetGamePath(type));
        }
    }

    private static Delete(type: GameType, identifier: string) {
        let list: Array<IModData> = Cache.Load(type);
        if (list.length == 0) throw new Error();

        const mod: IModData = Cache.Find(list, identifier);
        if (mod == null || IsNullOrEmpty(mod)) throw new Error();

        ModInstaller.Enable(type, mod.Hash, false);

        if (FsProvider.ExistsSync(mod.BasePath)) {
            try {
                FsProvider.RmSync(mod.BasePath, { recursive: true });
            } catch (e) {
                throw e;
            }
        }

        list = list.filter(i => i == Cache.Find(list, identifier));
        Cache.Save(type, list);

        FsProvider.CleanEmptyDirectories(PathResolver.MOD_DIR);
    }
}
