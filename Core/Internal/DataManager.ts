import * as fs from "fs"
import { GameType } from "../Enums/GameType"
import SettingsManager from "./SettingsManager"
import PathResolver from "../Resolvers/PathResolver"
import EnsureDirectoryExistence from "../Utils/EnsureDirectoryExistence"

export default abstract class DataManager {
    public static CreateIndex(type: GameType) {
        const file: string = PathResolver.INDEX_PATH(type)

        if (!fs.existsSync(file)) {
            EnsureDirectoryExistence(file)
            fs.writeFileSync(file, "[]")
        }
    }

    public static CreateSettings() {
        if (!fs.existsSync(PathResolver.SETTINGS_PATH)) {
            SettingsManager.Save({
                LastSelectedGame: GameType.None,
                GamePaths: new Map<string, string>
            })
        }
    }

    public static CreateModsFolder(type: GameType) {
        const folder: string = PathResolver.MOD_PATH(type)

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }
    }

    public static CreateDownloadsFolder(type: GameType) {
        const folder: string = PathResolver.DOWNLOAD_PATH(type)

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }
    }

    public static DeleteIndex(type: GameType) {
        const file: string = PathResolver.INDEX_PATH(type)

        if (fs.existsSync(file)) {
            fs.rmSync(file)
        }
    }

    public static DeleteSettings() {
        const file: string = PathResolver.SETTINGS_PATH

        if (fs.existsSync(file)) {
            fs.rmSync(file)
        }
    }

    public static DeleteDataFolder() {
        if (fs.existsSync(PathResolver.DATA_DIR)) {
            fs.rmSync(PathResolver.DATA_DIR)
        }
    }

    public static DeleteGameDataFolder(type: GameType) {
        const folder: string = PathResolver.MOD_PATH(type)

        if (fs.existsSync(folder)) {
            fs.rmSync(folder)
        }
    }

    public static IndexFileExists(type: GameType): boolean {
        const file: string = PathResolver.INDEX_PATH(type)

        if (fs.existsSync(file)) {
            return true
        }

        return false
    }

    public static SettingsFileExists(): boolean {
        const file: string = PathResolver.SETTINGS_PATH

        if (fs.existsSync(file)) {
            return true
        }

        return false
    }

    public static DataFolderExists(type: GameType): boolean {
        const folder: string = PathResolver.MOD_PATH(type)

        if (fs.existsSync(folder)) {
            return true
        }

        return false
    }

    public static ModsFolderExists(type: GameType): boolean {
        const folder: string = PathResolver.MOD_PATH(type)

        if (fs.existsSync(folder)) {
            return true
        }

        return false
    }

    public static DownloadsFolderExists(type: GameType): boolean {
        const folder: string = PathResolver.DOWNLOAD_PATH(type)

        if (fs.existsSync(folder)) {
            return true
        }

        return false
    }

    public static GetModsFolderPath(type: GameType): string {
        const folder: string = PathResolver.MOD_PATH(type)

        if (fs.existsSync(folder)) {
            return folder
        }

        return ""
    }

    public static GetDownloadsFolderPath(type: GameType): string {
        const folder: string = PathResolver.DOWNLOAD_PATH(type)

        if (fs.existsSync(folder)) {
            return folder
        }

        return ""
    }
}