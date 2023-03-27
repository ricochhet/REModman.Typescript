import * as fs from "fs"
import * as path from "path"
import { Globals } from "../Globals"
import { GameType } from "../Enums/GameType"
import { EnumHelper } from "../Enums/EnumHelper"
import { ModData } from "../Interfaces/IModData"
import { EnsureDirectoryExistence } from "../Utils/EnsureDirectoryExistence"

export abstract class ModManager {
    private static Save(type: GameType, list: Array<ModData>) {
        const folder: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))
        const file: string = path.join(folder, Globals.MOD_INDEX_FILE)

        const sorted: Array<ModData> = list.sort(i => i.LoadOrder)

        EnsureDirectoryExistence(file)
        fs.writeFileSync(file, JSON.stringify(sorted))
    }

    public static Load(type: GameType) {
        if (fs.existsSync(Globals.DATA_FOLDER)) {
            const file: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))

            if (fs.existsSync(file)) {
                return <Array<ModData>>JSON.parse(fs.readFileSync(file).toString())
            }

            return null
        }

        return null
    }

    public static Find(list: Array<ModData>, identifier: string) {
        return list.find(i => i.Hash == identifier) ?? null
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
}