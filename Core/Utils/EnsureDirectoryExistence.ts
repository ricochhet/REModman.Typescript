import * as path from "path"
import * as fs from "fs"

export function EnsureDirectoryExistence(filePath: string) {
    const directoryName: string = path.dirname(filePath)

    if (fs.existsSync(directoryName)) {
        return true
    }

    EnsureDirectoryExistence(directoryName)
    fs.mkdirSync(directoryName);
}