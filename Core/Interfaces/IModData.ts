import { ModFile } from "./IModFile"

export interface ModData {
    Name: string
    Hash: string
    LoadOrder: number
    BasePath: string
    IsEnabled: boolean
    Files: Array<ModFile>
}