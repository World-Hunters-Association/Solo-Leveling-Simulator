import type { Battler } from './Battler';

export class Unit {
	public constructor() {
		this.initialize();
	}

	public agility(): number {
		const members = this.members();
		if (members.length === 0) {
			return 1;
		}
		const sum = members.reduce((r, member) => {
			return r + member.agi;
		}, 0);
		return sum / members.length;
	}

	public aliveMembers(): Battler[] {
		return this.members().filter((member) => {
			return member.isAlive();
		});
	}

	public clearActions() {
		return this.members().forEach((member) => {
			return member.clearActions();
		});
	}

	public clearResults() {
		this.members().forEach((member) => {
			member.clearResult();
		});
	}

	public deadMembers(): Battler[] {
		return this.members().filter((member) => {
			return member.isDead();
		});
	}

	public inBattle(): boolean {
		return this._inBattle;
	}

	public initialize() {
		this._inBattle = false;
	}

	public isAllDead(): boolean {
		return this.aliveMembers().length === 0;
	}

	public makeActions() {
		this.members().forEach((member) => {
			member.makeActions();
		});
	}

	public members(): Battler[] {
		return [];
	}

	public movableMembers(): Battler[] {
		return this.members().filter((member) => {
			return member.canMove();
		});
	}

	public onBattleEnd() {
		this._inBattle = false;
		this.members().forEach((member) => {
			member.onBattleEnd();
		});
	}

	public onBattleStart() {
		this.members().forEach((member) => {
			member.onBattleStart();
		});
		this._inBattle = true;
	}

	public randomDeadTarget(): Battler | null {
		const members = this.deadMembers();
		if (members.length === 0) {
			return null;
		}
		return members[Math.floor(Math.random() * members.length)];
	}

	public randomTarget(): Battler | null {
		let tgrRand = Math.random() * this.tgrSum();
		let target: Battler | null = null;
		this.aliveMembers().forEach((member) => {
			tgrRand -= member.tgr;
			if (tgrRand <= 0 && !target) {
				target = member;
			}
		});
		return target;
	}

	public select(activeMember: Battler) {
		this.members().forEach((member) => {
			if (member === activeMember) {
				member.select();
			} else {
				member.deselect();
			}
		});
	}

	public smoothDeadTarget(index: number): Battler {
		if (index < 0) {
			index = 0;
		}
		const member = this.members()[index];
		return member && member.isDead() ? member : this.deadMembers()[0];
	}

	public smoothTarget(index: number): Battler {
		if (index < 0) {
			index = 0;
		}
		const member = this.members()[index];
		return member && member.isAlive() ? member : this.aliveMembers()[0];
	}

	public substituteBattler(): Battler | undefined {
		const members = this.members();
		for (const member of members) {
			if (member.isSubstitute()) {
				return member;
			}
		}
		return undefined;
	}

	public tgrSum(): number {
		return this.aliveMembers().reduce((r, member) => {
			return r + member.tgr;
		}, 0);
	}

	// public tpbBaseSpeed(): number

	// public tpbReferenceTime(): number

	// public updateTpb()
}

export interface Unit {
	_inBattle: boolean;
}
