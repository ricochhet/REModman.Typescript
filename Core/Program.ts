import { GameType } from "./Enums/GameType"
import ModManager from "./Internal/ModManager"
import DataManager from "./Internal/DataManager"
import { ModData } from "./Interfaces/IModData"

const index: Array<ModData> = ModManager.GenerateIndex(GameType.MonsterHunterRise)
ModManager.SaveAnyChanges(GameType.MonsterHunterRise, index)