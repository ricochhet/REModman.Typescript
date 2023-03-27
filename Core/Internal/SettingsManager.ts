import * as fs from "fs"
import * as path from "path"
import { Globals } from "../Globals"
import { SettingsData } from "../Interfaces/ISettingsData"
import { EnsureDirectoryExistence } from "../Utils/EnsureDirectoryExistence"

export abstract class SettingsManager {
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
}