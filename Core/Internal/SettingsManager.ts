import * as fs from "fs"
import * as path from "path"
import { GameType } from "../Enums/GameType"
import { Globals } from "../Globals"
import { SettingsData } from "../Interfaces/ISettingsData"
import { EnsureDirectoryExistence } from "../Utils/EnsureDirectoryExistence"
import { IsEmptyOrNull } from "../Utils/IsEmptyObject"

export default abstract class SettingsManager {
    public static Save(settings: SettingsData) {
        const file: string = path.join(Globals.DATA_FOLDER, Globals.SETTINGS_FILE)

        EnsureDirectoryExistence(file)
        fs.writeFileSync(file, JSON.stringify(settings, null, 2))
    }

    public static Load(): SettingsData {
        if (fs.existsSync(Globals.DATA_FOLDER)) {
            const file: string = path.join(Globals.DATA_FOLDER, Globals.SETTINGS_FILE)

            if (fs.existsSync(file)) {
                return <SettingsData>JSON.parse(fs.readFileSync(file).toString())
            }

            return <SettingsData>{}
        }

        return <SettingsData>{}
    }

    public static GetGamePath(type: GameType): string {
        const settings: SettingsData = SettingsManager.Load()
        if (settings == null || IsEmptyOrNull(settings))
            throw new Error()

        if (settings.GamePaths.has(type.toString())) {
            return path.dirname(settings.GamePaths[type.toString()])
        }

        throw new Error()
    }
}