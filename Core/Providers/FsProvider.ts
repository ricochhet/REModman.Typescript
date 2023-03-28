import * as fs from "fs"
import FileWriteError from "../Errors/FileWriteError"
import EnsureDirectoryExistence from "../Utils/EnsureDirectoryExistence"
import { SearchType } from "./Enums/SearchType"
import SearchHelper from "./SearchHelper"

export default class FsProvider {
    public static WriteFileSync(file: string, data: string): FileWriteError | undefined {
        try {
            fs.writeFileSync(file, data)
        } catch (e) {
            const err: Error = <Error>e
            return new FileWriteError("Failed to write file", err.message, null)
        }
    }

    public static EnsureDirectory(directory: string): FileWriteError | undefined {
        try {
            EnsureDirectoryExistence(directory)
        } catch (e) {
            const err: Error = <Error>e
            return new FileWriteError("Failed to write file", err.message, null)
        }
    }

    public static ExistsSync(directory: string): boolean {
        return fs.existsSync(directory)
    }

    public static Find(type: SearchType, directory: string): string[] {
        return SearchHelper(type, directory)
    }
}