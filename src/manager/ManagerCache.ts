import path from 'path';
import { REEngine } from '../patches/REEngine';
import { GameType } from '../enums/GameType';
import ManagerSettings from './ManagerSettings';
import { IModData } from '../interfaces/IModData';
import { IModFile } from '../interfaces/IModFile';
import PathResolver from '../resolvers/PathResolver';
import Checksum from './utils/Checksum';
import { IsNullOrEmpty } from './utils/IsNullOrEmpty';
import { SearchType } from '../providers/enums/SearchType';
import FsProvider from '../providers/generic/FsProvider';
import { ChecksumType } from './utils/enums/ChecksumType';

export default abstract class Cache {
    public static Save(type: GameType, list: Array<IModData>) {
        const file: string = PathResolver.INDEX_PATH(type);
        const sorted: Array<IModData> = list.sort(i => i.LoadOrder);

        FsProvider.EnsureDirectory(file);
        FsProvider.WriteFileSync(file, JSON.stringify(sorted));
    }

    public static Load(type: GameType): Array<IModData> {
        if (FsProvider.ExistsSync(PathResolver.DATA_PATH)) {
            const file: string = PathResolver.INDEX_PATH(type);

            if (FsProvider.ExistsSync(file)) {
                return <Array<IModData>>(
                    JSON.parse(FsProvider.ReadFileSync(file).toString())
                );
            }

            return <Array<IModData>>[];
        }

        return <Array<IModData>>[];
    }

    public static Find(list: Array<IModData>, identifier: string): IModData {
        if (list.length == 0 || list.length == undefined) return <IModData>{};

        return list.find(i => i.Hash == identifier) || <IModData>{};
    }

    public static SaveHashChanges(type: GameType, list: Array<IModData>) {
        const existing: Array<IModData> | null = Cache.Load(type);

        if (existing == null) throw new Error();

        const diffs: Array<IModData> = list.filter(
            p => !existing.every(l => p.Hash == l.Hash),
        );
        if (diffs.length != 0) {
            Cache.Save(type, list);
        }
    }

    public static SaveAnyChanges(type: GameType, list: Array<IModData>) {
        const existing: Array<IModData> | null = Cache.Load(type);

        if (existing == null) throw new Error();

        const diffs: Array<IModData> = list.filter(
            p =>
                !existing.every(l => p.Hash == l.Hash) ||
                existing.every(l => p != l),
        );
        if (diffs.length != 0) {
            Cache.Save(type, list);
        }
    }

    public static Build(type: GameType): Array<IModData> {
        const list: Array<IModData> = Cache.Load(type);

        if (list == null) throw new Error();

        const gameDirectory = ManagerSettings.GetGamePath(type);
        const gameModDirectory: string = PathResolver.MOD_PATH(type);

        if (FsProvider.ExistsSync(gameModDirectory)) {
            const modDirectories: string[] = FsProvider.GetPaths(
                SearchType.TopDirectoriesOnly,
                gameModDirectory,
            );

            modDirectories.forEach(modDirectory => {
                let hash: string = '';
                const modFiles: Array<IModFile> = [];
                const modItems: string[] = FsProvider.GetPaths(
                    SearchType.TopDirectoriesOnly,
                    modDirectory,
                );

                modItems.forEach(modItem => {
                    if (
                        REEngine.IsNatives(path.basename(modItem)) ||
                        REEngine.IsREF(path.basename(modItem))
                    ) {
                        const files = FsProvider.GetPaths(
                            SearchType.SearchAllFiles,
                            modItem,
                        );

                        files.forEach(file => {
                            if (FsProvider.IsPathSafe(file)) {
                                const installPath = path.join(
                                    gameDirectory,
                                    REEngine.InstallPath(file),
                                );
                                const fileHash: string = Checksum.File(ChecksumType.SHA256, file);
                                hash += fileHash;

                                modFiles.push({
                                    InstallPath: installPath,
                                    SourcePath: file,
                                    Hash: fileHash,
                                });
                            }
                        });
                    }
                });

                const files: string[] = FsProvider.GetPaths(
                    SearchType.TopFilesOnly,
                    modDirectory,
                );
                files.forEach(file => {
                    if (
                        FsProvider.IsPathSafe(file) &&
                        REEngine.IsValidPatchPak(file)
                    ) {
                        const installPath = path.join(
                            gameDirectory,
                            REEngine.InstallPath(file),
                        );
                        const fileHash: string = Checksum.File(ChecksumType.SHA256, file);
                        hash += fileHash;

                        modFiles.push({
                            InstallPath: installPath,
                            SourcePath: file,
                            Hash: fileHash,
                        });
                    }
                });

                const identifier: string = Checksum.String(ChecksumType.SHA256, hash);
                if (
                    modFiles.length != 0 &&
                    IsNullOrEmpty(Cache.Find(list, identifier))
                ) {
                    list.push({
                        Name: path.basename(modDirectory),
                        Hash: identifier,
                        LoadOrder: 0,
                        BasePath: modDirectory,
                        IsEnabled: false,
                        Files: modFiles,
                    });
                }
            });
        }

        return list.sort(i => i.LoadOrder);
    }
}
