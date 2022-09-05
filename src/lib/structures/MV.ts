import type { RPG } from './RPG';

export namespace MV {
	export interface BattleRewards {
		gold: number;
		exp: number;
		items: RPG.BaseItem[];
	}

	export type SelfSwitches = [number, RPG.Event['id'], string];
}
