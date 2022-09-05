import type { RPG } from '../RPG';
import { Interpreter } from './Interpreter';
import { Mob } from './Mob';
import { Unit } from './Unit';

export class Troop extends Unit {
	public clear() {
		this._interpreter.clear();
		this._troopId = 0;
		this._eventFlags = {};
		this._mobs = [];
		this._turnCount = 0;
		this._namesCount = {};
	}

	public deadMembers(): Mob[] {
		return super.deadMembers() as Mob[];
	}

	public mobNames(): string[] {
		const names: string[] = [];
		this.members().forEach((mob) => {
			const name = mob.originalName();
			if (mob.isAlive() && !names.contains(name)) {
				names.push(name);
			}
		});
		return names;
	}

	public expTotal(): number {
		return this.deadMembers().reduce((r, mob) => {
			return r + mob.exp();
		}, 0);
	}

	public goldRate(): number {
		return $gameParty.hasGoldDouble() ? 2 : 1;
	}

	public goldTotal(): number {
		return (
			this.deadMembers().reduce((r, mob) => {
				return r + mob.gold();
			}, 0) * this.goldRate()
		);
	}

	public increaseTurn() {
		const { pages } = this.troop();
		for (let i = 0; i < pages.length; i++) {
			const page = pages[i];
			if (page.span === 1) {
				this._eventFlags[i] = false;
			}
		}
		this._turnCount++;
	}

	public initialize() {
		super.initialize();
		this._interpreter = new Interpreter();
		this.clear();
	}

	public isEventRunning(): boolean {
		return this._interpreter.isRunning();
	}

	// public isTpbTurnEnd(): boolean

	public letterTable(): string[] {
		return $gameSystem.isCJK() ? Troop.LETTER_TABLE_FULL : Troop.LETTER_TABLE_HALF;
	}

	public makeDropItems(): RPG.BaseItem[] {
		return this.deadMembers().reduce<RPG.BaseItem[]>((r, mob) => {
			return r.concat(mob.makeDropItems());
		}, []);
	}

	public makeUniqueNames() {
		const table = this.letterTable();
		this.members().forEach((mob) => {
			if (mob.isAlive() && mob.isLetterEmpty()) {
				const name = mob.originalName();
				const n = this._namesCount[name] || 0;
				mob.setLetter(table[n % table.length]);
				this._namesCount[name] = n + 1;
			}
		}, this);
		this.members().forEach((mob) => {
			const name = mob.originalName();
			if (this._namesCount[name] >= 2) {
				mob.setPlural(true);
			}
		}, this);
	}

	public meetsConditions(page: RPG.BattleEventPage): boolean {
		const c = page.conditions;
		if (!c.turnEnding && !c.turnValid && !c.mobValid && !c.actorValid && !c.switchValid) {
			return false; // Conditions not set
		}
		if (c.turnEnding) {
			if (!BattleManager.isTurnEnd()) {
				return false;
			}
		}
		if (c.turnValid) {
			const n = this._turnCount;
			const a = c.turnA;
			const b = c.turnB;
			if (b === 0 && n !== a) {
				return false;
			}
			if (b > 0 && (n < 1 || n < a || n % b !== a % b)) {
				return false;
			}
		}
		if (c.mobValid) {
			const mob = $gameTroop.members()[c.mobIndex];
			if (!mob || mob.hpRate() * 100 > c.mobHp) {
				return false;
			}
		}
		if (c.actorValid) {
			const actor = $gameActors.actor(c.actorId);
			if (!actor || actor.hpRate() * 100 > c.actorHp) {
				return false;
			}
		}
		if (c.switchValid) {
			if (!$gameSwitches.value(c.switchId)) {
				return false;
			}
		}
		return true;
	}

	public members(): Mob[] {
		return this._mobs;
	}

	public setup(troopId: RPG.Troop['id']) {
		this.clear();
		this._troopId = troopId;
		this._mobs = [];
		this.troop().members.forEach((member) => {
			if ($dataMobs[member.mobId]) {
				const { mobId } = member;
				const { x } = member;
				const { y } = member;
				const mob = new Mob(mobId, x, y);
				if (member.hidden) {
					mob.hide();
				}
				this._mobs.push(mob);
			}
		}, this);
		this.makeUniqueNames();
	}

	public setupBattleEvent() {
		if (!this._interpreter.isRunning()) {
			if (this._interpreter.setupReservedCommonEvent()) {
				return;
			}
			const { pages } = this.troop();
			for (let i = 0; i < pages.length; i++) {
				const page = pages[i];
				if (this.meetsConditions(page) && !this._eventFlags[i]) {
					this._interpreter.setup(page.list);
					this._interpreter.setEventInfo({ eventType: 'battle_event', troopId: this._troopId, page: i + 1 });
					if (page.span <= 1) {
						this._eventFlags[i] = true;
					}
					break;
				}
			}
		}
	}

	public troop(troopId?: RPG.Troop['id']): RPG.Troop {
		return $dataTroops[this._troopId];
	}

	public turnCount(): number {
		return this._turnCount;
	}

	public updateInterpreter() {
		this._interpreter.update();
	}
}

export interface Troop {
	_interpreter: Interpreter;
	_troopId: number;
	_eventFlags: Record<number, boolean>;
	_mobs: Mob[];
	_turnCount: number;
	_namesCount: Record<string, number>;
}
