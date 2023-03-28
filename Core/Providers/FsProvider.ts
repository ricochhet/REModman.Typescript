import * as fs from "fs"
import { SearchType } from "./Enums/SearchType"
import { CleanEmptyDirectories, EnsureDirectoryExistence } from "./FsProviderUtils"
import FileReadError from "../Errors/FileReadError"
import FileWriteError from "../Errors/FileWriteError"
import FileCopyError from "../Errors/FileCopyError"
import FileRemoveError from "../Errors/FileRemoveError"
import SearchTypeHelper from "./Enums/SearchTypeHelper"

export default class FsProvider {
    public static ReadFileSync(directory: string): string {
        try {
            return fs.readFileSync(directory).toString()
        } catch (e) {
            const err: Error = <Error>e
            throw new FileReadError("Failed to read file", err.message, null)
        }
    }

    public static WriteFileSync(file: string, data: string): FileWriteError | undefined {
        try {
            fs.writeFileSync(file, data)
        } catch (e) {
            const err: Error = <Error>e
            return new FileWriteError("Failed to write file", err.message, null)
        }
    }

    public static CopyFileSync(src: string, dest: string): FileCopyError | undefined {
        try {
            fs.copyFileSync(src, dest)
        } catch (e) {
            const err: Error = <Error>e
            return new FileCopyError("Failed to copy file", err.message, null)
        }
    }

    public static RmSync(directory: string): FileRemoveError | undefined {
        try {
            fs.rmSync(directory)
        } catch (e) {
            const err: Error = <Error>e
            return new FileRemoveError("Failed to remove file", err.message, null)
        }
    }

    public static EnsureDirectory(directory: string): FileWriteError | undefined {
        try {
            EnsureDirectoryExistence(directory)
        } catch (e) {
            const err: Error = <Error>e
            return new FileWriteError("Failed to ensure directory", err.message, null)
        }
    }

    public static CleanDirectory(directory: string): FileRemoveError | undefined {
        try {
            CleanEmptyDirectories(directory)
        } catch (e) {
            const err: Error = <Error>e
            return new FileRemoveError("Failed to clean directory", err.message, null)
        }
    }

    public static ExistsSync(directory: string): boolean {
        return fs.existsSync(directory)
    }

    public static Find(type: SearchType, directory: string): string[] {
        return SearchTypeHelper(type, directory)
    }
}