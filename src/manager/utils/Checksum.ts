import { createHash } from 'crypto';
import EnumError from '../../errors/EnumError';
import FsProvider from '../../providers/generic/FsProvider';
import { ChecksumType } from './enums/ChecksumType';

export default class Checksum {
    public static String(type: ChecksumType, data: string) {
        switch (type) {
            case ChecksumType.SHA256:
                return createHash('sha256').update(data).digest('hex');
            case ChecksumType.MD5:
                return createHash('md5').update(data).digest('hex');
            default:
                throw new EnumError("ChecksumType", "default")
        }
    }

    public static File(type: ChecksumType, directory: string) {
        return Checksum.String(type, FsProvider.ReadFileSync(directory).toString())
    }
}