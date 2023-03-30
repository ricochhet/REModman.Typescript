import * as path from 'path';
import { GameType } from '../enums/GameType';
import { FileType } from './enums/FileType';
import { FolderType } from './enums/FolderType';
import GameTypeHelper from '../enums/GameTypeResolver';
import FsProvider from '../providers/generic/FsProvider';
import EnumError from '../errors/EnumError';

export default class PathResolver {
    private static _MOD_DIR: string = FolderType.MODS;
    private static _DATA_DIR: string = FolderType.DATA;
    private static _DOWNLOAD_DIR: string = FolderType.DOWNLOADS;

    private static _LOG_FILE: string = FileType.LOG;
    private static _INDEX_FILE: string = FileType.CACHE;
    private static _SETTINGS_FILE: string = FileType.SETTINGS;

    static get MOD_DIR(): string {
        return PathResolver._MOD_DIR;
    }

    static get DATA_PATH(): string {
        return PathResolver._DATA_DIR;
    }

    static get LOG_PATH(): string {
        return path.join(PathResolver._DATA_DIR, PathResolver._LOG_FILE);
    }

    static get SETTINGS_PATH(): string {
        return path.join(PathResolver._DATA_DIR, PathResolver._SETTINGS_FILE);
    }

    static INDEX_PATH(type: GameType): string {
        return path.join(
            PathResolver._DATA_DIR,
            GameTypeHelper.Path(type),
            PathResolver._INDEX_FILE,
        );
    }

    static MOD_PATH(type: GameType): string {
        return path.join(PathResolver._MOD_DIR, GameTypeHelper.Path(type));
    }

    static DOWNLOAD_PATH(type: GameType): string {
        return path.join(PathResolver._DOWNLOAD_DIR, GameTypeHelper.Path(type));
    }

    public static FOLDER(
        folder: FolderType,
        type: GameType = GameType.None,
    ): string | null {
        switch (folder) {
            case FolderType.MODS:
                return FsProvider.ExistsSync(PathResolver.MOD_PATH(type))
                    ? PathResolver.MOD_PATH(type)
                    : null;
            case FolderType.DATA:
                return FsProvider.ExistsSync(PathResolver.DATA_PATH)
                    ? PathResolver.DATA_PATH
                    : null;
            case FolderType.DOWNLOADS:
                return FsProvider.ExistsSync(PathResolver.DOWNLOAD_PATH(type))
                    ? PathResolver.DOWNLOAD_PATH(type)
                    : null;
            default:
                throw new EnumError('PATH', 'default');
        }
    }

    public static FILE(
        file: FileType,
        type: GameType = GameType.None,
    ): string | null {
        switch (file) {
            case FileType.LOG:
                return FsProvider.ExistsSync(PathResolver.LOG_PATH)
                    ? PathResolver.LOG_PATH
                    : null;
            case FileType.CACHE:
                return FsProvider.ExistsSync(PathResolver.INDEX_PATH(type))
                    ? PathResolver.INDEX_PATH(type)
                    : null;
            case FileType.SETTINGS:
                return FsProvider.ExistsSync(PathResolver.SETTINGS_PATH)
                    ? PathResolver.SETTINGS_PATH
                    : null;
            default:
                throw new EnumError('PATH', 'default');
        }
    }
}
