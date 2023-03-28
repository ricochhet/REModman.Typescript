import { SearchType } from "./SearchType"
import EnumError from "../../Errors/EnumError"
import { GetFiles, GetDirectories, GetDirectoriesRecursive } from "../FsProviderUtils"

export default function SearchTypeHelper(type: SearchType, directory: string): string[] {
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