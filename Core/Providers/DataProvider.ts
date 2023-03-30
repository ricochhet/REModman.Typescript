import { GameType } from '../Enums/GameType';
import FsProvider from './Generic/FsProvider';
import ManagerSettings from '../Manager/ManagerSettings';
import EnumResolver from '../Resolvers/EnumResolver';
import PathResolver from '../Resolvers/PathResolver';
import { FolderType } from '../Resolvers/Enums/FolderType';
import EnumError from '../Errors/EnumError';
import { FileType } from '../Resolvers/Enums/FileType';
import { MkdirMode } from './Enums/MkdirMode';
import { IDataProviderOptions } from './Interfaces/IDataProviderOptions';

export default abstract class DataProvider {
  private static CREATE_OPTIONS: IDataProviderOptions = {
    Game: GameType.None,
    Data: '[]',
  };

  public static Create(
    type: FileType | FolderType,
    options: IDataProviderOptions = DataProvider.CREATE_OPTIONS,
  ) {
    if (EnumResolver.From(FileType, type) ?? '' in FileType) {
      switch (type) {
        case FileType.LOG:
          FsProvider.EnsureDirectory(PathResolver.DATA_PATH);
          FsProvider.WriteFileSync(PathResolver.LOG_PATH, options.Data);
        case FileType.CACHE:
          FsProvider.EnsureDirectory(PathResolver.INDEX_PATH(options.Game));
          FsProvider.WriteFileSync(
            PathResolver.INDEX_PATH(options.Game),
            options.Data,
          );
        case FileType.SETTINGS:
          ManagerSettings.Save({
            LastSelectedGame: GameType.None,
            GamePaths: new Map<string, string>(),
          });
        default:
          throw new EnumError('FileType', 'default');
      }
    } else if (EnumResolver.From(FolderType, type) ?? '' in FolderType) {
      switch (type) {
        case FolderType.MODS:
          FsProvider.MkdirSync(
            PathResolver.MOD_PATH(options.Game),
            MkdirMode.NO_EXISTENCE,
          );
        case FolderType.DATA:
          FsProvider.MkdirSync(PathResolver.DATA_PATH, MkdirMode.NO_EXISTENCE);
        case FolderType.DOWNLOADS:
          FsProvider.MkdirSync(
            PathResolver.DOWNLOAD_PATH(options.Game),
            MkdirMode.NO_EXISTENCE,
          );
        default:
          throw new EnumError('FolderType', 'default');
      }
    }
  }

  public static Delete(pathResolverItem: string) {
    if (FsProvider.ExistsSync(pathResolverItem)) {
      FsProvider.RmSync(pathResolverItem, {});
    }
  }
}
