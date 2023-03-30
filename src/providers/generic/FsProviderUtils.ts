import * as fs from 'fs';
import * as path from 'path';

export function CleanEmptyDirectories(directory: string) {
    const isDirectory: boolean = fs.statSync(directory).isDirectory();

    if (!isDirectory) return;

    let files: string[] = fs.readdirSync(directory);
    if (files.length > 0) {
        files.forEach(file => {
            CleanEmptyDirectories(path.join(directory, file));
        });

        files = fs.readdirSync(directory);
    }

    if (files.length == 0) {
        fs.rmdirSync(directory);
        return;
    }
}

export function EnsureDirectoryExistence(filePath: string) {
    const directoryName: string = path.dirname(filePath);

    if (fs.existsSync(directoryName)) {
        return true;
    }

    EnsureDirectoryExistence(directoryName);
    fs.mkdirSync(directoryName);
}

export function GetDirectories(directory: string): string[] {
    return fs
        .readdirSync(directory)
        .map(i => path.join(directory, i))
        .filter(x => fs.statSync(x).isDirectory());
}

export function GetFiles(directory: string): string[] {
    return fs
        .readdirSync(directory)
        .map(i => path.join(directory, i))
        .filter(x => fs.statSync(x).isFile());
}

export function GetDirectoriesRecursive(directory: string): string[] {
    return [
        directory,
        ...GetDirectories(directory).map(GetDirectoriesRecursive),
    ].flat();
}

export function WalkDirectory(directory: string): string[] {
    const files: string[] = [];

    for (const file of _walkDirectory(directory)) {
        files.push(<string>file);
    }

    return files;
}

function* _walkDirectory(directory: string): Generator {
    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
        if (file.isDirectory()) {
            yield* _walkDirectory(path.join(directory, file.name));
        } else {
            yield path.join(directory, file.name);
        }
    }
}
