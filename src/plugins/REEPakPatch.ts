import * as fs from 'fs';
import * as path from 'path';
import { WalkDirectory } from '../utils/GetDirectories';
import { DynamicBuffer } from './buffer/DynamicBuffer';
import { MurMurHashV3 } from './MurMurHash';
import { FileEntry } from './FileEntry';

export function ProcessDirectory(
    directory: string,
    outputFile: string = 'MyMod.pak',
) {
    const folder: string = path.join(directory, 'natives');

    if (fs.existsSync(folder) && fs.statSync(folder).isDirectory()) {
        const sortedFiles = WalkDirectory(folder).sort();
        const fileEntries: Array<FileEntry> = [];
        const objBuffers: Array<Buffer> = [];
        let buf: DynamicBuffer = new DynamicBuffer({ encoding: 'utf16le' });
        let seek: number = 0;

        buf.appendUInt32LE(1095454795);
        buf.appendUInt32LE(4);
        buf.appendUInt32LE(sortedFiles.length);
        buf.appendUInt32LE(0);
        seek = 48 * sortedFiles.length + buf.length;

        sortedFiles.forEach(obj => {
            let entry: FileEntry = new FileEntry();

            let baseDirectory = directory;
            if (baseDirectory.startsWith('./')) {
                baseDirectory = directory.slice(2).split('\\').join('/');
            }

            let text: string = obj
                .split('\\')
                .join('/')
                .split(baseDirectory)
                .join('');
            if (text.startsWith('/')) {
                text = text.slice(1);
            }

            let hash: number = MurMurHashV3(
                text.toLocaleLowerCase(),
                4294967295,
            );
            let hash2: number = MurMurHashV3(
                text.toLocaleUpperCase(),
                4294967295,
            );
            let buf2: Buffer = fs.readFileSync(obj);

            entry.filename = text;
            entry.offset = BigInt(seek);
            entry.uncompSize = BigInt(buf2.length);
            entry.filenameLower = hash;
            entry.filenameUpper = hash2;

            fileEntries.push(entry);
            objBuffers.push(buf2);
            seek = seek + buf2.byteLength;
        });

        let y: number = 0;
        fileEntries.forEach(obj => {
            y++;

            if (y == 0) {
                buf.writeUInt32LE(obj.filenameLower, 16);
            } else {
                buf.appendUInt32LE(obj.filenameLower);
            }

            buf.appendUInt32LE(obj.filenameUpper);
            buf.appendUInt64LE(obj.offset);
            buf.appendUInt64LE(obj.uncompSize);
            buf.appendUInt64LE(obj.uncompSize);
            buf.appendUInt64LE(0n);
            buf.appendUInt32LE(0);
            buf.appendUInt32LE(0);
        });

        objBuffers.forEach(obj => {
            let buf2: Buffer = Buffer.concat([buf.toBuffer(), obj]);
            buf = new DynamicBuffer(buf2);
        });

        fs.writeFileSync(outputFile, buf.toBuffer());
    }
}
