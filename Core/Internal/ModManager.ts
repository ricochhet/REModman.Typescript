import * as fs from "fs"
import * as path from "path"
import { Globals } from "../Globals"
import { GameType } from "../Enums/GameType"
import { EnumHelper } from "../Enums/EnumHelper"
import { ModData } from "../Interfaces/IModData"
import { EnsureDirectoryExistence } from "../Utils/EnsureDirectoryExistence"
import { GetDirectories, GetFiles, WalkDirectory } from "../Utils/GetDirectories"
import { ModFile } from "../Interfaces/IModFile"
import { REEngine } from "../Data/REEngine"
import { IsSafe } from "../Utils/FileCheck"
import { FileSha256, Sha256 } from "../Utils/Sha256"
import { IsEmptyOrNull } from "../Utils/IsEmptyObject"

export abstract class ModManager {
    public static Save(type: GameType, list: Array<ModData>) {
        const folder: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))
        const file: string = path.join(folder, Globals.MOD_INDEX_FILE)

        const sorted: Array<ModData> = list.sort(i => i.LoadOrder)

        EnsureDirectoryExistence(file)
        fs.writeFileSync(file, JSON.stringify(sorted))
    }

    public static Load(type: GameType): Array<ModData> {
        if (fs.existsSync(Globals.DATA_FOLDER)) {
            const folder: string = path.join(Globals.DATA_FOLDER, EnumHelper.GetModFolder(type))
            const file: string = path.join(folder, Globals.MOD_INDEX_FILE)

            if (fs.existsSync(file)) {
                return <Array<ModData>>JSON.parse(fs.readFileSync(file).toString())
            }

            return <Array<ModData>>[]
        }

        return <Array<ModData>>[]
    }

    public static Find(list: Array<ModData>, identifier: string): ModData {
        if (list.length == 0 || list.length == undefined)
            return <ModData>{}

        return list.find(i => i.Hash == identifier) || <ModData>{}
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
        const list: Array<ModData> = ModManager.Load(type)

        if (list == null)
            throw new Error()

        const gameDirectory = ""
        const gameModDirectory: string = path.join(Globals.MODS_FOLDER, EnumHelper.GetModFolder(type))
        if (fs.existsSync(gameModDirectory)) {
            const modDirectories: string[] = GetDirectories(gameModDirectory)

            modDirectories.forEach(modDirectory => {
                let hash: string = ""
                const modFiles: Array<ModFile> = []
                const modItems: string[] = GetDirectories(modDirectory)

                modItems.forEach(modItem => {
                    if (REEngine.IsNatives(path.basename(modItem)) || REEngine.IsREF(path.basename(modItem))) {
                        const files = WalkDirectory(modItem)

                        files.forEach(file => {
                            if (IsSafe(file)) {
                                const installPath = path.join(gameDirectory, REEngine.InstallPath(file))
                                const fileHash: string = FileSha256(file)
                                hash += fileHash

                                modFiles.push({
                                    InstallPath: installPath,
                                    SourcePath: file,
                                    Hash: fileHash
                                })
                            }
                        })
                    }
                })

                const files: string[] = GetFiles(modDirectory)
                files.forEach(file => {
                    if (IsSafe(file) && REEngine.IsValidPatchPak(file)) {
                        const installPath = path.join(gameDirectory, REEngine.InstallPath(file))
                        const fileHash: string = FileSha256(file)
                        hash += fileHash

                        modFiles.push({
                            InstallPath: installPath,
                            SourcePath: file,
                            Hash: fileHash
                        })
                    }
                })

                const identifier: string = Sha256(hash)
                if (modFiles.length != 0 && IsEmptyOrNull(ModManager.Find(list, identifier))) {
                    list.push({
                        Name: path.basename(modDirectory),
                        Hash: identifier,
                        LoadOrder: 0,
                        BasePath: modDirectory,
                        IsEnabled: false,
                        Files: modFiles
                    })
                }
            })
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