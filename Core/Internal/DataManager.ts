import { Globals } from "../Globals"
import { GameType } from "../Enums/GameType"
import { ModData } from "../Interfaces/IModData"
import * as path from "path"
import * as fs from "fs"
import { EnumHelper } from "../Enums/EnumHelper"
import { EnsureDirectoryExistence } from "../Utils/EnsureDirectoryExistence"

export abstract class DataManager {
    public static CreateIndex(type: GameType) {
        const folder: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))
        const file: string = path.join(folder, Globals.MOD_INDEX_FILE)

        if (!fs.existsSync(file)) {
            EnsureDirectoryExistence(file)
            fs.writeFileSync(file, "[]")
        }
    }

    public static CreateSettings() {
        if (!fs.existsSync(path.join(Globals.DATA_FOLDER, Globals.SETTINGS_FILE))) {
            // TODO - Implement SettingsManager
            throw new Error()
        }
    }

    public static CreateModsFolder(type: GameType) {
        const folder: string = path.join(Globals.MODS_FOLDER, EnumHelper.GetModFolder(type))

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }
    }

    public static CreateDownloadsFolder(type: GameType) {
        const folder: string = path.join(Globals.DOWNLOADS_FOLDER, EnumHelper.GetModFolder(type))

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder)
        }
    }

    public static DeleteIndex(type: GameType) {
        const folder: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))
        const file: string = path.join(folder, Globals.MOD_INDEX_FILE)

        if (fs.existsSync(file)) {
            fs.rmSync(file)
        }
    }

    public static DeleteSettings() {
        const file: string = path.join(Globals.DATA_FOLDER, Globals.SETTINGS_FILE)

        if (fs.existsSync(file)) {
            fs.rmSync(file)
        }
    }

    public static DeleteDataFolder() {
        if (fs.existsSync(Globals.DATA_FOLDER)) {
            fs.rmSync(Globals.DATA_FOLDER)
        }
    }

    public static DeleteGameDataFolder(type: GameType) {
        const folder: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))

        if (fs.existsSync(folder)) {
            fs.rmSync(folder)
        }
    }

    public static IndexFileExists(type: GameType) {
        const folder: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))
        const file: string = path.join(folder, Globals.MOD_INDEX_FILE)

        if (fs.existsSync(file)) {
            return true
        }

        return false
    }

    public static SettingsFileExists() {
        const file: string = path.join(Globals.DATA_FOLDER, Globals.SETTINGS_FILE)

        if (fs.existsSync(file)) {
            return true
        }

        return false
    }

    public static DataFolderExists(type: GameType) {
        const folder: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))

        if (fs.existsSync(folder)) {
            return true
        }

        return false
    }

    public static ModsFolderExists(type: GameType) {
        const folder: string = path.join(Globals.MODS_FOLDER, EnumHelper.GetModFolder(type))

        if (fs.existsSync(folder)) {
            return true
        }

        return false
    }

    public static DownloadsFolderExists(type: GameType) {
        const folder: string = path.join(Globals.DOWNLOADS_FOLDER, EnumHelper.GetModFolder(type))

        if (fs.existsSync(folder)) {
            return true
        }

        return false
    }

    public static GetModsFolderPath(type: GameType) {
        const folder: string = path.join(Globals.MODS_FOLDER, EnumHelper.GetModFolder(type))

        if (fs.existsSync(folder)) {
            return folder
        }

        return null
    }

    public static GetDownloadsFolderPath(type: GameType) {
        const folder: string = path.join(Globals.DOWNLOADS_FOLDER, EnumHelper.GetModFolder(type))

        if (fs.existsSync(folder)) {
            return folder
        }

        return null
    }
}