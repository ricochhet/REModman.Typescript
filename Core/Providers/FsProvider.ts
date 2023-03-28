import * as fs from "fs"
import { SearchType } from "./Enums/SearchType"
import { CleanEmptyDirectories, EnsureDirectoryExistence } from "./FsProviderUtils"
import FileReadError from "../Errors/FileReadError"
import FileWriteError from "../Errors/FileWriteError"
import FileCopyError from "../Errors/FileCopyError"
import FileRemoveError from "../Errors/FileRemoveError"
import UnsafeOpError from "../Errors/UnsafeOpError"
import SearchTypeHelper from "./Enums/SearchTypeHelper"

export default class FsProvider {
    private static FILE_OP_SAFE_DEF: boolean = true

    private static IsPathSafe(directory: string) {
        const unsafeValues: string[] = [
            "desktop.ini",
            "thumbs.db"
        ]

        if (unsafeValues.includes(directory))
            throw new UnsafeOpError("Unsafe file operation", "Directory is unsafe")
    }

    public static ReadFileSync(directory: string, safety: boolean = FsProvider.FILE_OP_SAFE_DEF): string {
        try {
            if (safety) FsProvider.IsPathSafe(directory)
            return fs.readFileSync(directory).toString()
        } catch (e) {
            const err: Error = <Error>e
            throw new FileReadError("Failed to read file", err.message, null)
        }
    }

    public static WriteFileSync(file: string, data: string, safety: boolean = FsProvider.FILE_OP_SAFE_DEF): FileWriteError | undefined {
        try {
            if (safety) FsProvider.IsPathSafe(file)
            fs.writeFileSync(file, data)
        } catch (e) {
            const err: Error = <Error>e
            return new FileWriteError("Failed to write file", err.message, null)
        }
    }

    public static CopyFileSync(src: string, dest: string, safety: boolean = FsProvider.FILE_OP_SAFE_DEF): FileCopyError | undefined {
        try {
            if (safety) { 
                FsProvider.IsPathSafe(src)
                FsProvider.IsPathSafe(dest)
            } 

            fs.copyFileSync(src, dest)
        } catch (e) {
            const err: Error = <Error>e
            return new FileCopyError("Failed to copy file", err.message, null)
        }
    }

    public static RmSync(directory: string, safety: boolean = FsProvider.FILE_OP_SAFE_DEF): FileRemoveError | undefined {
        try {
            if (safety) FsProvider.IsPathSafe(directory)
            fs.rmSync(directory)
        } catch (e) {
            const err: Error = <Error>e
            return new FileRemoveError("Failed to remove file", err.message, null)
        }
    }

    public static EnsureDirectory(directory: string, safety: boolean = FsProvider.FILE_OP_SAFE_DEF): FileWriteError | undefined {
        try {
            if (safety) FsProvider.IsPathSafe(directory)
            EnsureDirectoryExistence(directory)
        } catch (e) {
            const err: Error = <Error>e
            return new FileWriteError("Failed to ensure directory", err.message, null)
        }
    }

    public static CleanDirectory(directory: string, safety: boolean = FsProvider.FILE_OP_SAFE_DEF): FileRemoveError | undefined {
        try {
            if (safety) FsProvider.IsPathSafe(directory)
            CleanEmptyDirectories(directory)
        } catch (e) {
            const err: Error = <Error>e
            return new FileRemoveError("Failed to clean directory", err.message, null)
        }
    }

    public static ExistsSync(directory: string, safety: boolean = FsProvider.FILE_OP_SAFE_DEF): boolean {
        return fs.existsSync(directory)
    }

    public static Find(type: SearchType, directory: string, safety: boolean = FsProvider.FILE_OP_SAFE_DEF): string[] {
        return SearchTypeHelper(type, directory)
    }
}