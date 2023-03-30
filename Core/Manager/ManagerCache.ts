import path from 'path';
import { REEngine } from '../Data/REEngine';
import { IsSafe } from '../Utils/FileCheck';
import { GameType } from '../Enums/GameType';
import ManagerSettings from './ManagerSettings';
import { ModData } from '../Interfaces/IModData';
import { ModFile } from '../Interfaces/IModFile';
import PathResolver from '../Resolvers/PathResolver';
import { FileSha256, Sha256 } from '../Utils/Sha256';
import { IsNullOrEmpty } from '../Utils/IsNullOrEmpty';
import { SearchType } from '../Providers/Enums/SearchType';
import FsProvider from '../Providers/Generic/FsProvider';

export default abstract class Cache {
  public static Save(type: GameType, list: Array<ModData>) {
    const file: string = PathResolver.INDEX_PATH(type);
    const sorted: Array<ModData> = list.sort(i => i.LoadOrder);

    FsProvider.EnsureDirectory(file);
    FsProvider.WriteFileSync(file, JSON.stringify(sorted));
  }

  public static Load(type: GameType): Array<ModData> {
    if (FsProvider.ExistsSync(PathResolver.DATA_DIR)) {
      const file: string = PathResolver.INDEX_PATH(type);

      if (FsProvider.ExistsSync(file)) {
        return <Array<ModData>>(
          JSON.parse(FsProvider.ReadFileSync(file).toString())
        );
      }

      return <Array<ModData>>[];
    }

    return <Array<ModData>>[];
  }

  public static Find(list: Array<ModData>, identifier: string): ModData {
    if (list.length == 0 || list.length == undefined) return <ModData>{};

    return list.find(i => i.Hash == identifier) || <ModData>{};
  }

  public static SaveHashChanges(type: GameType, list: Array<ModData>) {
    const existing: Array<ModData> | null = Cache.Load(type);

    if (existing == null) throw new Error();

    const diffs: Array<ModData> = list.filter(
      p => !existing.every(l => p.Hash == l.Hash),
    );
    if (diffs.length != 0) {
      Cache.Save(type, list);
    }
  }

  public static SaveAnyChanges(type: GameType, list: Array<ModData>) {
    const existing: Array<ModData> | null = Cache.Load(type);

    if (existing == null) throw new Error();

    const diffs: Array<ModData> = list.filter(
      p =>
        !existing.every(l => p.Hash == l.Hash) || existing.every(l => p != l),
    );
    if (diffs.length != 0) {
      Cache.Save(type, list);
    }
  }

  public static Build(type: GameType): Array<ModData> {
    const list: Array<ModData> = Cache.Load(type);

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
        const modFiles: Array<ModFile> = [];
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
              if (IsSafe(file)) {
                const installPath = path.join(
                  gameDirectory,
                  REEngine.InstallPath(file),
                );
                const fileHash: string = FileSha256(file);
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
          if (IsSafe(file) && REEngine.IsValidPatchPak(file)) {
            const installPath = path.join(
              gameDirectory,
              REEngine.InstallPath(file),
            );
            const fileHash: string = FileSha256(file);
            hash += fileHash;

            modFiles.push({
              InstallPath: installPath,
              SourcePath: file,
              Hash: fileHash,
            });
          }
        });

        const identifier: string = Sha256(hash);
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
