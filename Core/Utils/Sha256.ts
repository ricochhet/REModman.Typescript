import * as fs from "fs"
import { createHash } from "crypto"

export function Sha256(data: string) {
    return createHash('sha256').update(data).digest('hex')
}

export function FileSha256(directory: string) {
    return Sha256(fs.readFileSync(directory).toString())
}