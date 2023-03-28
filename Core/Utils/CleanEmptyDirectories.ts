import * as fs from "fs"
import * as path from "path"

export function CleanEmptyDirectories(directory: string) {
    const isDirectory: boolean = fs.statSync(directory).isDirectory()

    if (!isDirectory)
        return

    let files: string[] = fs.readdirSync(directory)
    if (files.length > 0) {
        files.forEach(file => {
            CleanEmptyDirectories(path.join(directory, file))
        })

        files = fs.readdirSync(directory)
    }

    if (files.length == 0) {
        fs.rmdirSync(directory)
        return
    }
}