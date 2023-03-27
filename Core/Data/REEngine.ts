import * as fs from "fs"
import * as path from "path"
import { GameType } from "../Enums/GameType"
import { ModData } from "../Interfaces/IModData"
import { ModFile } from "../Interfaces/IModFile"

export abstract class REEngine {
    private static ValidGameTypes: Array<GameType> = [
        GameType.MonsterHunterRise
    ]

    private static IsFilePatchPak(file: string) {
        return file.includes("re_chunk_") && file.includes("pak.patch") && file.includes(".pak")
    }

    private static FixPatchPakFileName(value: number) {
        return "re_chunk_000.pak.patch_<REPLACE>.pak".replace("<REPLACE>", value.toString())
    }

    public static IsNatives(directory: string) {
        return directory == "natives"
    }

    public static GetRelativeFromNatives(directory: string) {
        return "natives" + directory.split("natives")[1]
    }

    public static IsREF(directory: string) {
        return directory == "reframework"
    }

    public static GetRelativeFromREF(directory: string) {
        return "reframework" + directory.split("reframework")[1]
    }

    public static IsValidPatchPak(directory: string) {
        if (path.extname(directory) == ".pak") {
            if (REEngine.IsFilePatchPak(directory) || directory.includes("re_chunk_000")) {
                return false
            }

            return true
        }

        return false
    }

    public static HasValidPatchPaks(mod: ModData) {
        let hasValid: boolean = false

        for (const file of mod.Files) {
            if (REEngine.IsValidPatchPak(file.SourcePath)) {
                hasValid = true
                break
            }
        }

        return hasValid
    }

    public static Patch(list: Array<ModData>) {
        let startIndex: number = 2
        const patchList: Array<ModData> = list

        patchList.forEach(mod => {
            mod.Files.forEach(file => {
                if (path.extname(file.SourcePath) == ".pak") {
                    if (fs.existsSync(file.InstallPath)) {
                        fs.rmSync(file.InstallPath)
                    }
                }
            });
        });

        patchList.forEach(mod => {
            mod.Files.forEach(file => {
                if (path.extname(file.SourcePath) == ".pak" && !REEngine.IsValidPatchPak(file.SourcePath) && !file.SourcePath.includes("re_chunk_000") && mod.IsEnabled == true) {
                    const patchedPath: string = file.InstallPath.replace(path.basename(file.InstallPath), REEngine.FixPatchPakFileName(startIndex))
                    fs.copyFileSync(file.SourcePath, patchedPath)
                    file.InstallPath = patchedPath
                    startIndex++
                }
            });
        });

        return patchList
    }
}