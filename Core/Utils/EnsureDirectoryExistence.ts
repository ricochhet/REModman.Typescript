import * as fs from "fs"
import * as path from "path"

export default function EnsureDirectoryExistence(filePath: string) {
    const directoryName: string = path.dirname(filePath)

    if (fs.existsSync(directoryName)) {
        return true
    }

    EnsureDirectoryExistence(directoryName)
    fs.mkdirSync(directoryName);
}