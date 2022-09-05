import type { RPG } from '../RPG';
import type { Battler } from './Battler';
import type { Character } from './Character';
import type { Hunter } from './Hunter';
import type { Mob } from './Mob';

export class Interpreter {
	public changeHp(target: Battler, value: number, allowDeath: boolean) {
		if (target.isAlive()) {
			if (!allowDeath && target.hp <= -value) {
				value = 1 - target.hp;
			}
			target.gainHp(value);
			if (target.isDead()) {
				target.performCollapse();
			}
		}
	}

	public character(param: RPG.Event['id']): Character | null {
		if ($gameParty.inBattle()) {
			return null;
		} else if (param < 0) {
			return $gamePlayer;
		} else if (this.isOnCurrentMap()) {
			return $gameMap.event(param > 0 ? param : this._eventId);
		}
		return null;
	}

	public checkFreeze(): boolean {
		if (this._frameCount !== Graphics.frameCount) {
			this._frameCount = Graphics.frameCount;
			this._freezeChecker = 0;
		}
		if (this._freezeChecker++ >= 100000) {
			return true;
		}
		return false;
	}

	public checkOverflow() {
		if (this._depth >= 100) {
			throw new Error('Common event calls exceeded the limit');
		}
	}

	public clear() {
		this._mapId = 0;
		this._eventId = 0;
		this._list = null;
		this._index = 0;
		this._waitCount = 0;
		this._waitMode = '';
		this._comments = '';
		this._eventInfo = null;
		this._character = null;
		this._childInterpreter = null;
	}

	public currentCommand(): RPG.EventCommand {
		return this._list[this._index];
	}

	public eventId(): number {
		return this._eventId;
	}

	public executeCommand(): boolean {
		const command = this.currentCommand();
		if (command) {
			this._params = command.parameters;
			this._indent = command.indent;
			const methodName = `command${command.code}`;
			if (typeof this[methodName] === 'function') {
				try {
					if (!this[methodName]()) {
						return false;
					}
				} catch (error) {
					for (const key in this._eventInfo) {
						error[key] = this._eventInfo[key];
					}
					error.eventCommand = error.eventCommand || 'other';
					error.line = error.line || this._index + 1;
					throw error;
				}
			}
			this._index++;
		} else {
			this.terminate();
		}
		return true;
	}

	public fadeSpeed(): number {
		return 24;
	}

	public gameDataOperand(type: number, param1: number, param2: number): number {
		switch (type) {
			case 0: // Item
				return $gameParty.numItems($dataItems[param1]);
			case 1: // Weapon
				return $gameParty.numItems($dataWeapons[param1]);
			case 2: // Armor
				return $gameParty.numItems($dataArmors[param1]);
			case 3: {
				// Actor
				const actor = $gameActors.actor(param1);
				if (actor) {
					switch (param2) {
						case 0: // Level
							return actor.level;
						case 1: // EXP
							return actor.currentExp();
						case 2: // HP
							return actor.hp;
						case 3: // MP
							return actor.mp;
						default: // Parameter
							if (param2 >= 4 && param2 <= 11) {
								return actor.param(param2 - 4);
							}
					}
				}
				break;
			}
			case 4: {
				// Enemy
				const enemy = $gameTroop.members()[param1];
				if (enemy) {
					switch (param2) {
						case 0: // HP
							return enemy.hp;
						case 1: // MP
							return enemy.mp;
						default: // Parameter
							if (param2 >= 2 && param2 <= 9) {
								return enemy.param(param2 - 2);
							}
					}
				}
				break;
			}
			case 5: {
				// Character
				const character = this.character(param1);
				if (character) {
					switch (param2) {
						case 0: // Map X
							return character.x;
						case 1: // Map Y
							return character.y;
						case 2: // Direction
							return character.direction();
						case 3: // Screen X
							return character.screenX();
						case 4: // Screen Y
							return character.screenY();
					}
				}
				break;
			}
			case 6: // Party
				actor = $gameParty.members()[param1];
				return actor ? actor.actorId() : 0;
			case 7: // Other
				switch (param1) {
					case 0: // Map ID
						return $gameMap.mapId();
					case 1: // Party Members
						return $gameParty.size();
					case 2: // Gold
						return $gameParty.gold();
					case 3: // Steps
						return $gameParty.steps();
					case 4: // Play Time
						return $gameSystem.playtime();
					case 5: // Timer
						return $gameTimer.seconds();
					case 6: // Save Count
						return $gameSystem.saveCount();
					case 7: // Battle Count
						return $gameSystem.battleCount();
					case 8: // Win Count
						return $gameSystem.winCount();
					case 9: // Escape Count
						return $gameSystem.escapeCount();
				}
				break;
		}
		return 0;
	}

	public initialize() {
		this._depth = depth || 0;
		this.checkOverflow();
		this.clear();
		this._branch = {};
		this._params = [];
		this._indent = 0;
		this._frameCount = 0;
		this._freezeChecker = 0;
	}

	public isRunning(): boolean {
		return Boolean(this._list);
	}

	public iterateActorEx(param1: number, param2: number, callback: (hunter: Hunter) => any) {
		if (param1 === 0) {
			this.iterateActorId(param2, callback);
		} else {
			this.iterateActorId($gameletiables.value(param2), callback);
		}
	}

	public iterateActorId(param: number, callback: (hunter: Hunter) => any) {
		if (param === 0) {
			$gameParty.members().forEach(callback);
		} else {
			const actor = $gameActors.actor(param);
			if (actor) {
				callback(actor);
			}
		}
	}

	public iterateActorIndex(param: number, callback: (hunter: Hunter) => any) {
		if (param < 0) {
			$gameParty.members().forEach(callback);
		} else {
			const actor = $gameParty.members()[param];
			if (actor) {
				callback(actor);
			}
		}
	}

	public iterateBattler(param1: number, param2: number, callback: (battler: Battler) => any) {
		if ($gameParty.inBattle()) {
			if (param1 === 0) {
				this.iterateEnemyIndex(param2, callback);
			} else {
				this.iterateActorId(param2, callback);
			}
		}
	}

	public iterateEnemyIndex(param: number, callback: (mob: Mob) => any) {
		if (param < 0) {
			$gameTroop.members().forEach(callback);
		} else {
			const enemy = $gameTroop.members()[param];
			if (enemy) {
				callback(enemy);
			}
		}
	}

	public jumpTo(index: number) {
		const lastIndex = this._index;
		const startIndex = Math.min(index, lastIndex);
		const endIndex = Math.max(index, lastIndex);
		let indent = this._indent;
		for (let i = startIndex; i <= endIndex; i++) {
			const newIndent = this._list[i].indent;
			if (newIndent !== indent) {
				this._branch[indent] = null;
				indent = newIndent;
			}
		}
		this._index = index;
	}

	// public loadImages()

	public nextEventCode(): number {
		const command = this._list[this._index + 1];
		if (command) {
			return command.code;
		}
		return 0;
	}

	public operateValue(operation: number, operandType: number, operand: number): number {
		const value = operandType === 0 ? operand : $gameletiables.value(operand);
		return operation === 0 ? value : -value;
	}

	public operateletiable(letiableId: number, operationType: number, value: number) {
		try {
			let oldValue = $gameletiables.value(letiableId);
			switch (operationType) {
				case 0: // Set
					$gameletiables.setValue(letiableId, (oldValue = value));
					break;
				case 1: // Add
					$gameletiables.setValue(letiableId, oldValue + value);
					break;
				case 2: // Sub
					$gameletiables.setValue(letiableId, oldValue - value);
					break;
				case 3: // Mul
					$gameletiables.setValue(letiableId, oldValue * value);
					break;
				case 4: // Div
					$gameletiables.setValue(letiableId, oldValue / value);
					break;
				case 5: // Mod
					$gameletiables.setValue(letiableId, oldValue % value);
					break;
			}
		} catch (e) {
			$gameletiables.setValue(letiableId, 0);
		}
	}

	// public picturePoint(params: number): Point

	// public pluginCommand(command: string, args: string[])

	public setup(list: RPG.EventCommand[], eventId?: RPG.Event['id']) {
		this.clear();
		this._mapId = $gameMap.mapId();
		this._eventId = eventId || 0;
		this._list = list;
		Interpreter.requestImages(list);
	}

	public setupChild(list: RPG.EventCommand[], eventId: RPG.Event['id']) {
		this._childInterpreter = new Interpreter(this._depth + 1);
		this._childInterpreter.setup(list, eventId);
		this._childInterpreter.setEventInfo({ eventType: 'common_event', commonEventId: this._params[0] });
	}

	public setupChoices(params: any[]) {
		const choices = params[0].clone();
		let cancelType = params[1];
		const defaultType = params.length > 2 ? params[2] : 0;
		const positionType = params.length > 3 ? params[3] : 2;
		const background = params.length > 4 ? params[4] : 0;
		if (cancelType >= choices.length) {
			cancelType = -2;
		}
		$gameMessage.setChoices(choices, defaultType, cancelType);
		$gameMessage.setChoiceBackground(background);
		$gameMessage.setChoicePositionType(positionType);
		$gameMessage.setChoiceCallback(
			function (n) {
				this._branch[this._indent] = n;
			}.bind(this)
		);
	}

	public setupItemChoice(params: number[]) {
		$gameMessage.setItemChoice(params[0], params[1] || 2);
	}

	public setupNumInput(params: number[]) {
		$gameMessage.setNumberInput(params[0], params[1]);
	}

	public setupReservedCommonEvent(): boolean {
		if ($gameTemp.isCommonEventReserved()) {
			this.setup($gameTemp.reservedCommonEvent().list);
			this.setEventInfo({ eventType: 'common_event', commonEventId: $gameTemp.reservedCommonEventId() });
			$gameTemp.clearCommonEvent();
			return true;
		}
		return false;
	}

	public setWaitMode(waitMode: string) {
		this._waitMode = waitMode;
	}

	public skipBranch() {
		while (this._list[this._index + 1].indent > this._indent) {
			this._index++;
		}
	}

	public terminate() {
		this._list = null;
		this._comments = '';
	}

	public update() {
		while (this.isRunning()) {
			if (this.updateChild() || this.updateWait()) {
				break;
			}
			if (SceneManager.isSceneChanging()) {
				break;
			}
			if (!this.executeCommand()) {
				break;
			}
			if (this.checkFreeze()) {
				break;
			}
		}
	}

	public updateChild(): boolean {
		if (this._childInterpreter) {
			this._childInterpreter.update();
			if (this._childInterpreter.isRunning()) {
				return true;
			}
			this._childInterpreter = null;
		}
		return false;
	}

	public updateWait(): boolean {
		return this.updateWaitCount() || this.updateWaitMode();
	}

	public updateWaitCount(): boolean {
		if (this._waitCount > 0) {
			this._waitCount--;
			return true;
		}
		return false;
	}

	public updateWaitMode(): boolean {
		let waiting = false;
		switch (this._waitMode) {
			case 'message':
				waiting = $gameMessage.isBusy();
				break;
			case 'transfer':
				waiting = $gamePlayer.isTransferring();
				break;
			case 'scroll':
				waiting = $gameMap.isScrolling();
				break;
			case 'route':
				waiting = this._character.isMoveRouteForcing();
				break;
			case 'animation':
				waiting = this._character.isAnimationPlaying();
				break;
			case 'balloon':
				waiting = this._character.isBalloonPlaying();
				break;
			case 'gather':
				waiting = $gamePlayer.areFollowersGathering();
				break;
			case 'action':
				waiting = BattleManager.isActionForced();
				break;
			case 'video':
				waiting = Graphics.isVideoPlaying();
				break;
			case 'image':
				waiting = !ImageManager.isReady();
				break;
		}
		if (!waiting) {
			this._waitMode = '';
		}
		return waiting;
	}

	// public videoFileExt(): string

	public wait(duration: number) {
		this._waitCount = duration;
	}
}

export interface Interpreter {
	_depth: number;
	_branch: number;
	_indent: number;
	_frameCount: number;
	_freezeChecker: number;
	_mapId: number;
	_eventId: number;
	_list: RPG.EventCommand[];
	_index: number;
	_waitCount: number;
	_waitMode: string;
	_comments: string;
	_characterId: number;
	_childInterpreter: Interpreter;
}
