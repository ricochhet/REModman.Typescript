export class FileEntry {
    public id: string;
    public offset: bigint;
    public compSize: bigint;
    public uncompSize: bigint;
    public filename: string;
    public unk1: string;
    public unk2: string;
    public filenameLower: number;
    public filenameUpper: number;

    constructor() {
        this.id = '';
        this.offset = 0n;
        this.compSize = 0n;
        this.uncompSize = 0n;
        this.filename = '';
        this.unk1 = '';
        this.unk2 = '';
        this.filenameLower = 0;
        this.filenameUpper = 0;
    }
}
