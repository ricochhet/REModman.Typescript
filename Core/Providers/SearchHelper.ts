import { SearchType } from "./Enums/SearchType"
import EnumError from "../Errors/EnumError"
import { GetFiles, GetDirectories, GetDirectoriesRecursive } from "../Utils/GetDirectories"

export default function SearchHelper(type: SearchType, directory: string): string[] {
    switch (type) {
        case SearchType.TopFilesOnly:
            return GetFiles(directory)
        case SearchType.TopDirectoriesOnly:
            return GetDirectories(directory)
        case SearchType.SearchAllDirectories:
            return GetDirectoriesRecursive(directory)
        default:
            throw new EnumError("SearchType", "Enum defaulted")
    }
}