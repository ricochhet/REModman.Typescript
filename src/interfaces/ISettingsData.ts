import { GameType } from '../enums/GameType';

export interface ISettingsData {
  LastSelectedGame: GameType;
  GamePaths: Map<string, string>;
}
