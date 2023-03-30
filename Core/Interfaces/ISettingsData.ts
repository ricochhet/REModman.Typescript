import { GameType } from '../Enums/GameType';

export interface ISettingsData {
  LastSelectedGame: GameType;
  GamePaths: Map<string, string>;
}
