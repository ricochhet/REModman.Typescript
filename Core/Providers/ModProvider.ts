import * as fs from "fs"
import * as path from "path"
import { REEngine } from "../Data/REEngine"
import { IsSafe } from "../Utils/FileCheck"
import { GameType } from "../Enums/GameType"
import FsProvider from "./Generic/FsProvider"
import { SearchType } from "./Enums/SearchType"
import { ModData } from "../Interfaces/IModData"
import { ModFile } from "../Interfaces/IModFile"
import SettingsManager from "./SettingsProvider"
import PathResolver from "../Resolvers/PathResolver"
import { FileSha256, Sha256 } from "../Utils/Sha256"
import { IsEmptyOrNull } from "../Utils/IsEmptyObject"

export default abstract class ModManager {
    private static Save(type: GameType, list: Array<ModData>) {
        const file: string = PathResolver.INDEX_PATH(type)
        const sorted: Array<ModData> = list.sort(i => i.LoadOrder)

        FsProvider.EnsureDirectory(file)
        FsProvider.WriteFileSync(file, JSON.stringify(sorted))
    }

    public static Load(type: GameType): Array<ModData> {
        if (FsProvider.ExistsSync(PathResolver.DATA_DIR)) {
            const file: string = PathResolver.INDEX_PATH(type)

            if (fs.existsSync(file)) {
                return <Array<ModData>>JSON.parse(FsProvider.ReadFileSync(file).toString())
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

        const gameDirectory = SettingsManager.GetGamePath(type)
        const gameModDirectory: string = PathResolver.MOD_PATH(type)

        if (fs.existsSync(gameModDirectory)) {
            const modDirectories: string[] = FsProvider.GetPaths(SearchType.TopDirectoriesOnly, gameModDirectory)

            modDirectories.forEach(modDirectory => {
                let hash: string = ""
                const modFiles: Array<ModFile> = []
                const modItems: string[] = FsProvider.GetPaths(SearchType.TopDirectoriesOnly, modDirectory)

                modItems.forEach(modItem => {
                    if (REEngine.IsNatives(path.basename(modItem)) || REEngine.IsREF(path.basename(modItem))) {
                        const files = FsProvider.GetPaths(SearchType.SearchAllFiles, modItem)

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

                const files: string[] = FsProvider.GetPaths(SearchType.TopFilesOnly, modDirectory)
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
        const list: Array<ModData> = ModManager.Load(type)
        if (list.length == 0)
            throw new Error()

        const mod: ModData = ModManager.Find(list, identifier)
        if (mod == null || IsEmptyOrNull(mod))
            throw new Error()

        if (mod.LoadOrder == order)
            return

        mod.LoadOrder = order
        ModManager.SaveAnyChanges(type, list)
    }

    public static GetLoadOrder(type: GameType, identifier: string): number {
        const list: Array<ModData> = ModManager.Load(type)
        if (list.length == 0)
            throw new Error()

        const mod: ModData = ModManager.Find(list, identifier)
        if (mod == null || IsEmptyOrNull(mod))
            throw new Error()


        return mod.LoadOrder
    }

    public static Enable(type: GameType, identifier: string, isEnabled: boolean) {
        let list: Array<ModData> = ModManager.Load(type)
        if (list.length == 0)
            throw new Error()

        const mod: ModData = ModManager.Find(list, identifier)
        if (mod == null || IsEmptyOrNull(mod))
            throw new Error()

        if (mod.IsEnabled == isEnabled)
            return

        mod.IsEnabled = isEnabled
        const containsValidPaks: boolean = REEngine.HasValidPatchPaks(mod)

        if (isEnabled) {
            if (containsValidPaks) {
                list = REEngine.Patch(list)
            }

            ModManager.Install(type, mod)
        } else {
            ModManager.Uninstall(type, mod)

            if (containsValidPaks) {
                list = REEngine.Patch(list)
            }
        }

        ModManager.SaveAnyChanges(type, list)
    }

    private static Install(type: GameType, mod: ModData) {
        if (fs.existsSync(SettingsManager.GetGamePath(type))) {
            mod.Files.forEach(file => {
                fs.copyFileSync(file.SourcePath, file.InstallPath)
            })
        }
    }

    private static Uninstall(type: GameType, mod: ModData) {
        if (fs.existsSync(SettingsManager.GetGamePath(type))) {
            mod.Files.forEach(file => {
                if (fs.existsSync(file.InstallPath)) {
                    try {
                        fs.rmSync(file.InstallPath)
                    } catch (e) {
                        const err: Error = <Error>e
                        throw e
                    }
                }
            })

            FsProvider.CleanEmptyDirectories(SettingsManager.GetGamePath(type))
        }
    }

    private static Delete(type: GameType, identifier: string) {
        let list: Array<ModData> = ModManager.Load(type)
        if (list.length == 0)
            throw new Error()

        const mod: ModData = ModManager.Find(list, identifier)
        if (mod == null || IsEmptyOrNull(mod))
            throw new Error()

        ModManager.Enable(type, mod.Hash, false)

        if (fs.existsSync(mod.BasePath)) {
            try {
                fs.rmSync(mod.BasePath, { recursive: true })
            } catch (e) {
                throw e
            }
        }

        list = list.filter(i => i == ModManager.Find(list, identifier))
        ModManager.Save(type, list)

        FsProvider.CleanEmptyDirectories(PathResolver.MOD_DIR)
    }
}