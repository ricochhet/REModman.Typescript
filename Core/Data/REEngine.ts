import * as fs from "fs"
import * as path from "path"
import { ModData } from "../Interfaces/IModData"

export abstract class REEngine {
    private static IsFilePatchPak(file: string): boolean {
        return file.includes("re_chunk_") && file.includes("pak.patch") && file.includes(".pak")
    }

    private static FixPatchPakFileName(value: number): string {
        return "re_chunk_000.pak.patch_<REPLACE>.pak".replace("<REPLACE>", value.toString())
    }

    public static InstallPath(directory: string): string {
        if (REEngine.IsNatives(directory)) {
            return REEngine.GetRelativeFromNatives(directory)
        } else if (REEngine.IsREF(directory)) {
            return REEngine.GetRelativeFromREF(directory)
        } else if (REEngine.IsValidPatchPak(directory)) {
            return path.basename(directory)
        }
        
        return ""
    }

    public static IsNatives(directory: string): boolean {
        return directory == "natives"
    }

    public static GetRelativeFromNatives(directory: string): string {
        return "natives" + directory.split("natives")[1]
    }

    public static IsREF(directory: string): boolean {
        return directory == "reframework"
    }

    public static GetRelativeFromREF(directory: string): string {
        return "reframework" + directory.split("reframework")[1]
    }

    public static IsValidPatchPak(directory: string): boolean {
        if (path.extname(directory) == ".pak") {
            if (REEngine.IsFilePatchPak(directory) || directory.includes("re_chunk_000")) {
                return false
            }

            return true
        }

        return false
    }

    public static HasValidPatchPaks(mod: ModData): boolean {
        let hasValid: boolean = false

        for (const file of mod.Files) {
            if (REEngine.IsValidPatchPak(file.SourcePath)) {
                hasValid = true
                break
            }
        }

        return hasValid
    }

    public static Patch(list: Array<ModData>): Array<ModData> {
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