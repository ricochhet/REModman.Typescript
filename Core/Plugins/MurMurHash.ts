export function MurMurHashV3(key: string, seed: number): number {
    const buf = Buffer.from(key, "utf16le")
    let remainder: number = buf.length & 3;
    let bytes: number = buf.length - remainder;
    let h1: number = seed;
    let c1: number = 0xcc9e2d51;
    let c2: number = 0x1b873593;
    let i: number = 0;
    let k1: number
    let h1b: number


    while (i < bytes) {
        k1 = ((buf[i] & 0xff)) | ((buf[++i] & 0xff) << 8) | ((buf[++i] & 0xff) << 16) | ((buf[++i] & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
        case 4: k1 ^= (buf[i + 3] & 0xff) << 24;
        case 3: k1 ^= (buf[i + 2] & 0xff) << 16;
        case 2: k1 ^= (buf[i + 1] & 0xff) << 8;
        case 1: k1 ^= (buf[i] & 0xff);

            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
    }

    h1 ^= buf.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
}