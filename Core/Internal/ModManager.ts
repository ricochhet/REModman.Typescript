import * as fs from "fs"
import * as path from "path"
import { Globals } from "../Globals"
import { GameType } from "../Enums/GameType"
import { EnumHelper } from "../Enums/EnumHelper"
import { ModData } from "../Interfaces/IModData"
import { EnsureDirectoryExistence } from "../Utils/EnsureDirectoryExistence"
import { GetDirectories } from "../Utils/GetDirectories"
import { ModFile } from "../Interfaces/IModFile"
import { REEngine} from "../Data/REEngine"
 
export abstract class ModManager {
    private static Save(type: GameType, list: Array<ModData>) {
        const folder: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))
        const file: string = path.join(folder, Globals.MOD_INDEX_FILE)

        const sorted: Array<ModData> = list.sort(i => i.LoadOrder)

        EnsureDirectoryExistence(file)
        fs.writeFileSync(file, JSON.stringify(sorted))
    }

    public static Load(type: GameType): Array<ModData> {
        if (fs.existsSync(Globals.DATA_FOLDER)) {
            const file: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))

            if (fs.existsSync(file)) {
                return <Array<ModData>>JSON.parse(fs.readFileSync(file).toString())
            }

            return <Array<ModData>>{}
        }

        return <Array<ModData>>{}
    }

    public static Find(list: Array<ModData>, identifier: string): ModData {
        return <ModData>list.find(i => i.Hash == identifier)
    }

    public static SaveHashChanges(type: GameType, list: Array<ModData>) {
        const existing: Array<ModData> | null = ModManager.Load(type)

        if (existing == null)
            throw new Error()

        const diffs: Array<ModData> = list.filter(p => !existing.every(l => p.Hash == l.Hash))
        if (diffs.length != 0) {
            ModManager.Save(type, list)
        }
    }

    public static SaveAnyChanges(type: GameType, list: Array<ModData>) {
        const existing: Array<ModData> | null = ModManager.Load(type)

        if (existing == null)
            throw new Error()

        const diffs: Array<ModData> = list.filter(p => !existing.every(l => p.Hash == l.Hash) || existing.every(l => p != l))
        if (diffs.length != 0) {
            ModManager.Save(type, list)
        }
    }

    public static GenerateIndex(type: GameType): Array<ModData> {
        const list: Array<ModData> | null = ModManager.Load(type)

        if (list == null)
            throw new Error()

        const gameDirectory: string = path.join(Globals.MODS_FOLDER, EnumHelper.GetModFolder(type))
        if (fs.existsSync(gameDirectory)) {
            const modDirectories: string[] = GetDirectories(gameDirectory)

            for (const directory in modDirectories) {
                let hash: string = ""
                const files: Array<ModFile> = []
                const modItems: string[] = GetDirectories(directory)

                for (const item in modItems) {
                    if (REEngine.IsNatives(path.basename(item))) {
                        // TODO - implement action for natives
                    } else if (REEngine.IsREF(path.basename(item))) {
                        // TODO - implement action for reframework
                    }
                }

                // TODO - implement searching for mod files

                // TODO - implement adding mods to index
            }
        }

        return list.sort(i => i.LoadOrder)
    }

    public static SetLoadOrder(type: GameType, identifier: string, order: number) {
        // TODO - implement setting load order of identified mod
    }

    public static GetLoadOrder(type: GameType, identifier: string): number {
        // TODO - implement getting load order of identified mod
        return 0
    }

    public static Enable(type: GameType, identifier: string) {
        // TODO - set active state of identified mod
    }

    private static Install(type: GameType, mod: ModData) {
        // TODO - implement install action
    }

    private static Uninstall(type: GameType, mod: ModData) {
        // TODO - implement uninstall action
    }

    private static Delete(type: GameType, identifier: string) {
        // TODO - implement delete action
    }
}