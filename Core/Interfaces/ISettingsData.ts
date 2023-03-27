import { GameType } from "../Enums/GameType"

export interface SettingsData {
    LastSelectedGame: GameType,
    GamePaths: Map<string, string>
}