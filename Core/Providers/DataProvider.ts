import { GameType } from "../Enums/GameType"
import FsProvider from "./Generic/FsProvider"
import SettingsManager from "./SettingsProvider"
import PathResolver from "../Resolvers/PathResolver"

export default abstract class DataManager {
    public static CreateIndex(type: GameType) {
        const file: string = PathResolver.INDEX_PATH(type)

        if (!FsProvider.ExistsSync(file)) {
            FsProvider.EnsureDirectory(file)
            FsProvider.WriteFileSync(file, "[]")
        }
    }

    public static CreateSettings() {
        if (!FsProvider.ExistsSync(PathResolver.SETTINGS_PATH)) {
            SettingsManager.Save({
                LastSelectedGame: GameType.None,
                GamePaths: new Map<string, string>
            })
        }
    }

    public static CreateModsFolder(type: GameType) {
        const folder: string = PathResolver.MOD_PATH(type)

        if (!FsProvider.ExistsSync(folder)) {
            FsProvider.MkdirSync(folder)
        }
    }

    public static CreateDownloadsFolder(type: GameType) {
        const folder: string = PathResolver.DOWNLOAD_PATH(type)

        if (!FsProvider.ExistsSync(folder)) {
            FsProvider.MkdirSync(folder)
        }
    }

    public static DeleteIndex(type: GameType) {
        const file: string = PathResolver.INDEX_PATH(type)

        if (FsProvider.ExistsSync(file)) {
            FsProvider.RmSync(file)
        }
    }

    public static DeleteSettings() {
        const file: string = PathResolver.SETTINGS_PATH

        if (FsProvider.ExistsSync(file)) {
            FsProvider.RmSync(file)
        }
    }

    public static DeleteDataFolder() {
        if (FsProvider.ExistsSync(PathResolver.DATA_DIR)) {
            FsProvider.RmSync(PathResolver.DATA_DIR)
        }
    }

    public static DeleteGameDataFolder(type: GameType) {
        const folder: string = PathResolver.MOD_PATH(type)

        if (FsProvider.ExistsSync(folder)) {
            FsProvider.RmSync(folder)
        }
    }

    public static IndexFileExists(type: GameType): boolean {
        return FsProvider.ExistsSync(PathResolver.INDEX_PATH(type))
    }

    public static SettingsFileExists(): boolean {
        return FsProvider.ExistsSync(PathResolver.SETTINGS_PATH)
    }

    public static DataFolderExists(type: GameType): boolean {
        return FsProvider.ExistsSync(PathResolver.MOD_PATH(type))
    }

    public static ModsFolderExists(type: GameType): boolean {
        return FsProvider.ExistsSync(PathResolver.MOD_PATH(type))
    }

    public static DownloadsFolderExists(type: GameType): boolean {
        return FsProvider.ExistsSync(PathResolver.DOWNLOAD_PATH(type))
    }

    public static GetModsFolderPath(type: GameType): string {
        const folder: string = PathResolver.MOD_PATH(type)

        if (FsProvider.ExistsSync(folder)) {
            return folder
        }

        return ""
    }

    public static GetDownloadsFolderPath(type: GameType): string {
        const folder: string = PathResolver.DOWNLOAD_PATH(type)

        if (FsProvider.ExistsSync(folder)) {
            return folder
        }

        return ""
    }
}