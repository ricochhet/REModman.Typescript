import * as fs from "fs"
import * as path from "path"

export function GetDirectories(directory: string): string[] {
    return fs.readdirSync(directory).map(i => path.join(directory, i)).filter(x => fs.statSync(x).isDirectory())
}

export function GetDirectoriesRecursive(directory: string): string[] {
    return [directory, ...GetDirectories(directory).map(GetDirectoriesRecursive)].flat()
}