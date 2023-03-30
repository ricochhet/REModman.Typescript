import * as fs from 'fs';
import { SearchType } from '../enums/SearchType';
import FileReadError from '../../errors/FileReadError';
import FileCopyError from '../../errors/FileCopyError';
import UnsafeOpError from '../../errors/UnsafeOpError';
import SearchTypeResolver from '../enums/SearchTypeResolver';
import FileWriteError from '../../errors/FileWriteError';
import FileRemoveError from '../../errors/FileRemoveError';
import {
    CleanEmptyDirectories,
    EnsureDirectoryExistence,
} from './FsProviderUtils';
import { MkdirMode } from '../enums/MkdirMode';
import EnumError from '../../errors/EnumError';

export default class FsProvider {
    private static CHECK_FILE_SAFETY: boolean = true;

    public static IsPathSafe(directory: string): boolean {
        const unsafeValues: string[] = ['desktop.ini', 'thumbs.db'];

        if (unsafeValues.includes(directory))
            throw new UnsafeOpError(
                'Unsafe file operation',
                'Directory is unsafe',
            );

        return true;
    }

    public static ReadFileSync(
        directory: string,
        safety: boolean = FsProvider.CHECK_FILE_SAFETY,
    ): string {
        try {
            if (safety) FsProvider.IsPathSafe(directory);
            return fs.readFileSync(directory).toString();
        } catch (e) {
            const err: Error = <Error>e;
            throw new FileReadError('Failed to read file', err.message, null);
        }
    }

    public static WriteFileSync(
        file: string,
        data: string,
        safety: boolean = FsProvider.CHECK_FILE_SAFETY,
    ): FileWriteError | undefined {
        try {
            if (safety) FsProvider.IsPathSafe(file);
            fs.writeFileSync(file, data);
        } catch (e) {
            const err: Error = <Error>e;
            return new FileWriteError(
                'Failed to write file',
                err.message,
                null,
            );
        }
    }

    public static CopyFileSync(
        src: string,
        dest: string,
        safety: boolean = FsProvider.CHECK_FILE_SAFETY,
    ): FileCopyError | undefined {
        try {
            if (safety) {
                FsProvider.IsPathSafe(src);
                FsProvider.IsPathSafe(dest);
            }

            fs.copyFileSync(src, dest);
        } catch (e) {
            const err: Error = <Error>e;
            return new FileCopyError('Failed to copy file', err.message, null);
        }
    }

    public static MkdirSync(
        directory: string,
        mode: MkdirMode = MkdirMode.ANY_EXISTENCE,
        safety: boolean = FsProvider.CHECK_FILE_SAFETY,
    ): FileWriteError | undefined {
        try {
            if (safety) FsProvider.IsPathSafe(directory);
            switch (mode) {
                case MkdirMode.ANY_EXISTENCE:
                    fs.mkdirSync(directory);
                case MkdirMode.NO_EXISTENCE:
                    if (!FsProvider.ExistsSync(directory)) {
                        fs.mkdirSync(directory);
                    } else {
                        return new FileWriteError(
                            'Failed to write directory',
                            'Directory already exists',
                            null,
                        );
                    }
                default:
                    throw new EnumError('MkdirMode', 'default');
            }
        } catch (e) {
            const err: Error = <Error>e;
            return new FileWriteError(
                'Failed to write directory',
                err.message,
                null,
            );
        }
    }

    public static RmSync(
        directory: string,
        options: fs.RmOptions,
        safety: boolean = FsProvider.CHECK_FILE_SAFETY,
    ): FileRemoveError | undefined {
        try {
            if (safety) FsProvider.IsPathSafe(directory);
            fs.rmSync(directory, options);
        } catch (e) {
            const err: Error = <Error>e;
            return new FileRemoveError(
                'Failed to remove file',
                err.message,
                null,
            );
        }
    }

    public static EnsureDirectory(
        directory: string,
        safety: boolean = FsProvider.CHECK_FILE_SAFETY,
    ): FileWriteError | undefined {
        try {
            if (safety) FsProvider.IsPathSafe(directory);
            EnsureDirectoryExistence(directory);
        } catch (e) {
            const err: Error = <Error>e;
            return new FileWriteError(
                'Failed to ensure directory',
                err.message,
                null,
            );
        }
    }

    public static CleanEmptyDirectories(
        directory: string,
        safety: boolean = FsProvider.CHECK_FILE_SAFETY,
    ): FileRemoveError | undefined {
        try {
            if (safety) FsProvider.IsPathSafe(directory);
            CleanEmptyDirectories(directory);
        } catch (e) {
            const err: Error = <Error>e;
            return new FileRemoveError(
                'Failed to clean directory',
                err.message,
                null,
            );
        }
    }

    public static ExistsSync(
        directory: string,
        safety: boolean = FsProvider.CHECK_FILE_SAFETY,
    ): boolean {
        if (safety) FsProvider.IsPathSafe(directory);
        return fs.existsSync(directory);
    }

    public static GetPaths(
        type: SearchType,
        directory: string,
        safety: boolean = FsProvider.CHECK_FILE_SAFETY,
    ): string[] {
        if (safety) FsProvider.IsPathSafe(directory);
        return SearchTypeResolver(type, directory);
    }
}
