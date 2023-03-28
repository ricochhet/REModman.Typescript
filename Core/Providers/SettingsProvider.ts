import * as path from "path"
import { GameType } from "../Enums/GameType"
import FsProvider from "./Generic/FsProvider"
import { SettingsData } from "../Interfaces/ISettingsData"
import { IsEmptyOrNull } from "../Utils/IsEmptyObject"
import PathResolver from "../Resolvers/PathResolver"

export default abstract class SettingsManager {
    public static Save(settings: SettingsData) {
        const file: string = PathResolver.SETTINGS_PATH

        FsProvider.EnsureDirectory(file)
        FsProvider.WriteFileSync(file, JSON.stringify(settings, null, 2))
    }

    public static Load(): SettingsData {
        if (FsProvider.ExistsSync(PathResolver.DATA_DIR)) {
            const file: string = PathResolver.SETTINGS_PATH

            if (FsProvider.ExistsSync(file)) {
                return <SettingsData>JSON.parse(FsProvider.ReadFileSync(file).toString())
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