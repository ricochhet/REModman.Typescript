import * as path from "path"

export default class PathResolver {
    private static _MOD_DIR: string = "./Mods/"
    private static _DATA_DIR: string = "./Data/"
    private static _DOWNLOAD_DIR: string = "./Downloads/"

    private static _LOG_FILE: string = "log.txt"
    private static _INDEX_FILE: string = "modlist.json"
    private static _SETTINGS_FILE: string = "settings.json"

    static get MOD_DIR(): string {
        return PathResolver._MOD_DIR
    }

    static get DATA_DIR(): string {
        return PathResolver._DATA_DIR
    }

    static get DOWNLOAD_DIR(): string {
        return PathResolver._DOWNLOAD_DIR
    }

    static get LOG_PATH(): string {
        return path.join(PathResolver._DATA_DIR, PathResolver._LOG_FILE)
    }

    static get SETTINGS_PATH(): string {
        return path.join(PathResolver._DATA_DIR, PathResolver._SETTINGS_FILE)
    }

    static INDEX_PATH(sub: string): string {
        return path.join(PathResolver._DATA_DIR, sub, PathResolver._INDEX_FILE)
    }

    static MOD_PATH(sub: string): string {
        return path.join(PathResolver._MOD_DIR, sub) 
    }
}