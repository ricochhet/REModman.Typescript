const invalidFiles: string[] = [
    "desktop.ini",
    "thumbs.db"
]

export function IsSafe(file: string): boolean {
    if (invalidFiles.includes(file)) {
        return false
    }

    return true
}