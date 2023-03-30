import { GameType } from './GameType';
import EnumError from '../errors/EnumError';
import * as Strings from './GameTypeStrings';

export default abstract class GameTypeHelper {
    public static Path(type: GameType) {
        switch (type) {
            case GameType.None:
                throw new EnumError(
                    'GameType selected none',
                    'GameType switch-case selected None',
                );
            case GameType.MonsterHunterRise:
                return Strings.MONSTER_HUNTER_RISE_MOD_FOLDER;
            case GameType.MonsterHunterWorld:
                return Strings.MONSTER_HUNTER_WORLD_MOD_FOLDER;
            default:
                throw new EnumError('GameType', 'default');
        }
    }

    public static Proc(type: GameType) {
        switch (type) {
            case GameType.None:
                throw new EnumError(
                    'GameType selected none',
                    'GameType switch-case selected None',
                );
            case GameType.MonsterHunterRise:
                return Strings.MONSTER_HUNTER_RISE_PROC_NAME;
            case GameType.MonsterHunterWorld:
                return Strings.MONSTER_HUNTER_WORLD_PROC_NAME;
            default:
                throw new EnumError('GameType', 'default');
        }
    }
}
