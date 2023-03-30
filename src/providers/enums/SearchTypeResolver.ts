import { SearchType } from './SearchType';
import EnumError from '../../errors/EnumError';
import {
    GetFiles,
    WalkDirectory,
    GetDirectories,
    GetDirectoriesRecursive,
} from '../Generic/FsProviderUtils';

export default function SearchTypeResolver(
    type: SearchType,
    directory: string,
): string[] {
    switch (type) {
        case SearchType.TopFilesOnly:
            return GetFiles(directory);
        case SearchType.SearchAllFiles:
            return WalkDirectory(directory);
        case SearchType.TopDirectoriesOnly:
            return GetDirectories(directory);
        case SearchType.SearchAllDirectories:
            return GetDirectoriesRecursive(directory);
        default:
            throw new EnumError('SearchType', 'default');
    }
}
