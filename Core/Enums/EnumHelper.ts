import { GameType } from "../Enums/GameType"
import { Globals } from "../Globals";

export abstract class EnumHelper {
    public static GetModFolder(type: GameType) {
        switch (type) {
            case GameType.None:
                throw new Error()
            case GameType.MonsterHunterRise:
                return Globals.MONSTER_HUNTER_RISE_MOD_FOLDER
            case GameType.MonsterHunterWorld:
                return Globals.MONSTER_HUNTER_WORLD_MOD_FOLDER
            default:
                throw new Error()
        }
    }

    public static GetProcName(type: GameType) {
        switch (type) {
            case GameType.None:
                throw new Error()
            case GameType.MonsterHunterRise:
                return Globals.MONSTER_HUNTER_RISE_PROC_NAME
            case GameType.MonsterHunterWorld:
                return Globals.MONSTER_HUNTER_WORLD_PROC_NAME
            default:
                throw new Error()
        }
    }
}