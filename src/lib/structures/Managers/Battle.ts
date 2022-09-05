import { Action } from '../Game/Action';
import type { Battler } from '../Game/Battler';
import type { Hunter } from '../Game/Hunter';
import type { Mob } from '../Game/Mob';
import type { Party } from '../Game/Party';
import type { Troop } from '../Game/Troop';
import type { MV } from '../MV';
import type { RPG } from '../RPG';

export class BattleManager {
	public constructor(troopId: RPG.Troop['id'], canEscape: boolean, canLose: boolean) {
		this.setup(troopId, canEscape, canLose);
	}

	public abort() {
		this._phase = 'aborting';
	}

	public hunter(): Hunter | null {
		return this._hunterIndex >= 0 ? this._party.members()[this._hunterIndex] : null;
	}

	public allBattleMembers(): Battler[] {
		return (this._party.members() as Battler[]).concat(this._troop.members());
	}

	public applySubstitute(target: Battler): Battler {
		if (this.checkSubstitute(target)) {
			const substitute = (target as Mob).friendsUnit().substituteBattler();
			if (substitute && target !== substitute) {
				// this._logWindow.displaySubstitute(substitute, target);
				return substitute;
			}
		}
		return target;
	}

	// public cancelHunterInput()

	public canEscape(): boolean {
		return this._canEscape;
	}

	public canLose(): boolean {
		return this._canLose;
	}

	public checkAbort(): boolean {
		if (this._party.isEmpty() || this.isAborting()) {
			// SoundManager.playEscape();
			this._escaped = true;
			this.processAbort();
		}
		return false;
	}

	public checkBattleEnd(): boolean {
		if (this._phase) {
			if (this.checkAbort()) {
				return true;
			} else if (this._party.isAllDead()) {
				this.processDefeat();
				return true;
			} else if (this._troop.isAllDead()) {
				this.processVictory();
				return true;
			}
		}
		return false;
	}

	public checkSubstitute(target: Battler): boolean {
		return target.isDying() && !this._action.isCertainHit();
	}

	// public checkTpbInputClose()

	// public checkTpbInputOpen()

	// public checkTpbTurnEnd()

	// public changeCurrentHunter(forward: boolean)

	// public displayBattlerStatus()

	public displayDefeatMessage() {
		// $gameMessage.add(TextManager.defeat.format(this._party.name()));
	}

	public displayDropItems() {
		// const { items } = this._rewards;
		// if (items.length > 0) {
		// 	$gameMessage.newPage();
		// 	items.forEach((item) => {
		// 		$gameMessage.add(TextManager.obtainItem.format(item.name));
		// 	});
		// }
	}

	public displayEscapeFailureMessage() {
		// $gameMessage.add(TextManager.escapeStart.format(this._party.name()));
		// $gameMessage.add(`\.${TextManager.escapeFailure}`);
	}

	public displayEscapeSuccessMessage() {
		// $gameMessage.add(TextManager.escapeStart.format(this._party.name()));
	}

	public displayExp() {
		// const { exp } = this._rewards;
		// if (exp > 0) {
		// 	const text = TextManager.obtainExp.format(exp, TextManager.exp);
		// 	$gameMessage.add(`\.${text}`);
		// }
	}

	public displayGold() {
		// const { gold } = this._rewards;
		// if (gold > 0) {
		// 	$gameMessage.add(`\.${TextManager.obtainGold.format(gold)}`);
		// }
	}

	public displayRewards() {
		this.displayExp();
		this.displayGold();
		this.displayDropItems();
	}

	public displayStartMessages() {
		// this._troop.mobNames().forEach((name) => {
		// 	$gameMessage.add(TextManager.emerge.format(name));
		// });
		// if (this._preemptive) {
		// 	$gameMessage.add(TextManager.preemptive.format(this._party.name()));
		// } else if (this._surprise) {
		// 	$gameMessage.add(TextManager.surprise.format(this._party.name()));
		// }
	}

	public displayVictoryMessage() {
		// $gameMessage.add(TextManager.victory.format(this._party.name()));
	}

	public endAction() {
		// this._logWindow.endAction(this._subject);
		this._phase = 'turn';
	}

	public endBattle(result: number) {
		this._phase = 'battleEnd';
		if (this._eventCallback) {
			this._eventCallback(result);
		}
		if (result === 0) {
			// $gameSystem.onBattleWin();
		} else if (this._escaped) {
			// $gameSystem.onBattleEscape();
		}
	}

	// public endBattlerActions()

	// public endAllBattlersTurn()

	public endTurn() {
		this._phase = 'turnEnd';
		this._preemptive = false;
		this._surprise = false;
		this.allBattleMembers().forEach((battler) => {
			battler.onTurnEnd();
			this.refreshStatus();
			// this._logWindow.displayAutoAffectedStatus(battler);
			// this._logWindow.displayRegeneration(battler);
		}, this);
		// if (this.isForcedTurn()) {
		// 	this._turnForced = false;
		// }
	}

	// public finishHunterInput()

	public forceAction(battler: Battler) {
		this._actionForcedBattler = battler;
		const index = this._actionBattlers.indexOf(battler);
		if (index >= 0) {
			this._actionBattlers.splice(index, 1);
		}
	}

	public gainDropItems() {
		const { items } = this._rewards;
		items.forEach((item) => {
			this._party.gainItem(item, 1);
		});
	}

	public gainExp() {
		const { exp } = this._rewards;
		this._party.allMembers().forEach((hunter) => {
			hunter.gainExp(exp);
		});
	}

	public gainGold() {
		this._party.gainGold(this._rewards.gold);
	}

	public gainRewards() {
		this.gainExp();
		this.gainGold();
		this.gainDropItems();
	}

	public getNextSubject(): Battler | null {
		for (;;) {
			const battler = this._actionBattlers.shift();
			if (!battler) {
				return null;
			}
			if ((battler as Hunter | Mob).isBattleMember() && battler.isAlive()) {
				return battler;
			}
		}
	}

	public initMembers() {
		this._phase = 'init';
		this._canEscape = false;
		this._canLose = false;
		this._battleTest = false;
		this._eventCallback = null;
		this._preemptive = false;
		this._surprise = false;
		this._hunterIndex = -1;
		this._actionForcedBattler = null;
		// this._mapBgm = null;
		// this._mapBgs = null;
		this._actionBattlers = [];
		this._subject = null as unknown as BattleManager['_subject'];
		this._action = null as unknown as BattleManager['_action'];
		this._targets = [];
		// this._logWindow = null;
		// this._statusWindow = null;
		// this._spriteset = null;
		this._escapeRatio = 0;
		this._escaped = false;
		this._rewards = {} as unknown as BattleManager['_rewards'];
		// this._turnForced = false;
	}

	public inputtingAction(): Action | null {
		const hunter = this.hunter();
		return hunter ? hunter.inputtingAction() : null;
	}

	public invokeAction(subject: Battler, target: Battler) {
		// this._logWindow.push('pushBaseLine');
		if (Math.random() < this._action.itemCnt(target)) {
			this.invokeCounterAttack(subject, target);
		} else if (Math.random() < this._action.itemMrf(target)) {
			this.invokeMagicReflection(subject, target);
		} else {
			this.invokeNormalAction(subject, target);
		}
		subject.setLastTarget(target);
		// this._logWindow.push('popBaseLine');
		this.refreshStatus();
	}

	public invokeCounterAttack(subject: Battler, target: Battler) {
		const action = new Action(target);
		action.setAttack();
		action.apply(subject);
		// this._logWindow.displayCounter(target);
		// this._logWindow.displayActionResults(target, subject);
	}

	public invokeMagicReflection(subject: Battler, _target: Battler) {
		// this._action._reflectionTarget = target;
		// this._logWindow.displayReflection(target);
		this._action.apply(subject);
		// this._logWindow.displayActionResults(target, subject);
	}

	public invokeNormalAction(subject: Battler, target: Battler) {
		const realTarget = this.applySubstitute(target);
		this._action.apply(realTarget);
		// this._logWindow.displayActionResults(subject, realTarget);
	}

	// public isActiveTpb(): boolean

	public isAborting(): boolean {
		return this._phase === 'aborting';
	}

	public isActionForced(): boolean {
		return Boolean(this._actionForcedBattler);
	}

	public isBattleEnd(): boolean {
		return this._phase === 'battleEnd';
	}

	public isBattleTest(): boolean {
		return this._battleTest;
	}

	public isBusy(): boolean {
		return $gameMessage.isBusy() || this._spriteset.isBusy() || this._logWindow.isBusy();
	}

	public isEscaped(): boolean {
		return this._escaped;
	}

	public isInputting(): boolean {
		return this._phase === 'input';
	}

	// public isTpb(): boolean

	public isInTurn(): boolean {
		return this._phase === 'turn';
	}

	// public isPartyTpbInputtable(): boolean

	// public isTpbMainPhase(): boolean

	public isTurnEnd(): boolean {
		return this._phase === 'turnEnd';
	}

	public makeActionOrders() {
		let battlers: Battler[] = [];
		if (!this._surprise) {
			battlers = battlers.concat(this._party.members());
		}
		if (!this._preemptive) {
			battlers = battlers.concat(this._troop.members());
		}
		battlers.forEach((battler) => {
			battler.makeSpeed();
		});
		battlers.sort((a, b) => {
			return b.speed() - a.speed();
		});
		this._actionBattlers = battlers;
	}

	public makeEscapeRatio() {
		this._escapeRatio = (0.5 * this._party.agility()) / this._troop.agility();
	}

	public makeRewards() {
		this._rewards = {
			gold: this._troop.goldTotal(),
			exp: this._troop.expTotal(),
			items: this._troop.makeDropItems()
		};
	}

	// public needsHunterInputCancel(): boolean

	public onEncounter() {
		this._preemptive = Math.random() < this._party.ratePreemptive(this._troop.agility());
		this._surprise = Math.random() < this.rateSurprise() && !this._preemptive;
	}

	// public onEscapeFailure()

	// public onEscapeSuccess()

	// public playBattleBgm() {
	// 	AudioManager.playBgm($gameSystem.battleBgm());
	// 	AudioManager.stopBgs();
	// }

	// public playDefeatMe() {
	// 	AudioManager.playMe($gameSystem.defeatMe());
	// }

	// public playVictoryMe() {
	// 	AudioManager.playMe($gameSystem.victoryMe());
	// }

	public processAbort() {
		this._party.removeBattleStates();
		// this.replayBgmAndBgs();
		this.endBattle(1);
	}

	public processDefeat() {
		this.displayDefeatMessage();
		// this.playDefeatMe();
		if (this._canLose) {
			// this.replayBgmAndBgs();
		} else {
			// AudioManager.stopBgm();
		}
		this.endBattle(2);
	}

	public processEscape(): boolean {
		this._party.performEscape();
		// SoundManager.playEscape();
		const success = this._preemptive ? true : Math.random() < this._escapeRatio;
		if (success) {
			this.displayEscapeSuccessMessage();
			this._escaped = true;
			this.processAbort();
		} else {
			this.displayEscapeFailureMessage();
			this._escapeRatio += 0.1;
			this._party.clearActions();
			this.startTurn();
		}
		return success;
	}

	public processForcedAction() {
		if (this._actionForcedBattler) {
			// this._turnForced = true;
			this._subject = this._actionForcedBattler;
			this._actionForcedBattler = null;
			this.startAction();
			this._subject.removeCurrentAction();
		}
	}

	public processTurn() {
		const subject = this._subject;
		const action = subject.currentAction();
		if (action) {
			action.prepare();
			if (action.isValid()) {
				this.startAction();
			}
			subject.removeCurrentAction();
		} else {
			subject.onAllActionsEnd();
			this.refreshStatus();
			// this._logWindow.displayAutoAffectedStatus(subject);
			// this._logWindow.displayCurrentState(subject);
			// this._logWindow.displayRegeneration(subject);
			this._subject = this.getNextSubject()!;
		}
	}

	public processVictory() {
		this._party.removeBattleStates();
		this._party.performVictory();
		// this.playVictoryMe();
		// this.replayBgmAndBgs();
		this.makeRewards();
		this.displayVictoryMessage();
		this.displayRewards();
		this.gainRewards();
		this.endBattle(0);
	}

	public rateSurprise(): number {
		return this._party.rateSurprise(this._troop.agility());
	}

	public refreshStatus() {
		// this._statusWindow.refresh();
	}

	// public replayBgmAndBgs() {
	// 	if (this._mapBgm) {
	// 		AudioManager.replayBgm(this._mapBgm);
	// 	} else {
	// 		AudioManager.stopBgm();
	// 	}
	// 	if (this._mapBgs) {
	// 		AudioManager.replayBgs(this._mapBgs);
	// 	}
	// }

	// public saveBgmAndBgs() {
	// 	this._mapBgm = AudioManager.saveBgm();
	// 	this._mapBgs = AudioManager.saveBgs();
	// }

	// public selectNextHunter()

	public selectNextCommand() {
		do {
			const hunter = this.hunter();
			if (!hunter || !hunter.selectNextCommand()) {
				this.changeHunter(this._hunterIndex + 1, 'waiting');
				if (this._hunterIndex >= this._party.size()) {
					this.startTurn();
					break;
				}
			}
		} while (!this.hunter()?.canInput());
	}

	// public selectPreviousHunter()

	public selectPreviousCommand() {
		do {
			const hunter = this.hunter();
			if (!hunter || !hunter.selectPreviousCommand()) {
				this.changeHunter(this._hunterIndex - 1, 'undecided');
				if (this._hunterIndex < 0) {
					return;
				}
			}
		} while (!this.hunter()?.canInput());
	}

	public setBattleTest(battleTest: boolean) {
		this._battleTest = battleTest;
	}

	public setEventCallback(callback: (args: any) => any) {
		this._eventCallback = callback;
	}

	// public setLogWindow(logWindow) {
	// 	this._logWindow = logWindow;
	// }

	// public setSpriteset(spriteset) {
	// 	this._spriteset = spriteset;
	// }

	public setup(troopId: RPG.Troop['id'], canEscape: boolean, canLose: boolean) {
		this.initMembers();
		this._canEscape = canEscape;
		this._canLose = canLose;
		this._troop.setup(troopId);
		// $gameScreen.onBattleStart();
		this.makeEscapeRatio();
	}

	public startAction() {
		const subject = this._subject;
		const action = subject.currentAction();
		const targets = action.makeTargets();
		this._phase = 'action';
		this._action = action;
		this._targets = targets;
		subject.useItem(action.item());
		this._action.applyGlobal();
		this.refreshStatus();
		// this._logWindow.startAction(subject, action, targets);
	}

	// public startHunterInput()

	public startBattle() {
		this._phase = 'start';
		// $gameSystem.onBattleStart();
		this._party.onBattleStart();
		this._troop.onBattleStart();
		this.displayStartMessages();
	}

	public startInput() {
		this._phase = 'input';
		this._party.makeActions();
		this._troop.makeActions();
		// this.clearHunter();
		if (this._surprise || !this._party.canInput()) {
			this.startTurn();
		}
	}

	public startTurn() {
		this._phase = 'turn';
		// this.clearHunter();
		this._troop.increaseTurn();
		this.makeActionOrders();
		this._party.requestMotionRefresh();
		// this._logWindow.startTurn();
	}

	public update(timeActive?: boolean) {
		if (!this.isBusy() && !this.updateEvent()) {
			switch (this._phase) {
				case 'start':
					this.startInput();
					break;
				case 'turn':
					this.updateTurn(timeActive);
					break;
				case 'action':
					this.updateAction();
					break;
				case 'turnEnd':
					this.updateTurnEnd();
					break;
				case 'battleEnd':
					this.updateBattleEnd();
					break;
				default:
			}
		}
	}

	public updateAction() {
		const target = this._targets.shift();
		if (target) {
			this.invokeAction(this._subject, target);
		} else {
			this.endAction();
		}
	}

	// public updateAllTpbBattlers()

	public updateBattleEnd() {
		if (this.isBattleTest()) {
			// AudioManager.stopBgm();
			// SceneManager.exit();
		} else if (!this._escaped && this._party.isAllDead()) {
			if (this._canLose) {
				this._party.reviveBattleMembers();
				// SceneManager.pop();
			} else {
				// SceneManager.goto(Scene_Gameover);
			}
		} else {
			// SceneManager.pop();
		}
		this._phase = null;
	}

	public updateEvent(): boolean {
		switch (this._phase) {
			case 'start':
			case 'turn':
			case 'turnEnd':
				if (this.isActionForced()) {
					this.processForcedAction();
					return true;
				}
				return this.updateEventMain();
			default:
		}
		return this.checkAbort();
	}

	public updateEventMain(): boolean {
		this._troop.updateInterpreter();
		this._party.requestMotionRefresh();
		if (this._troop.isEventRunning() || this.checkBattleEnd()) {
			return true;
		}
		this._troop.setupBattleEvent();
		if (this._troop.isEventRunning()) {
			return true;
		}
		return false;
	}

	// public updatePhase(timeActive: boolean)

	// public updateTpb()

	// public updateTpbBattler(battler: Battler)

	// public updateTpbInput()

	// public updateStart()

	public updateTurn(timeActive?: boolean) {
		this._party.requestMotionRefresh();
		if (!this._subject) {
			this._subject = this.getNextSubject()!;
		}
		if (this._subject) {
			this.processTurn();
		} else {
			this.endTurn();
		}
	}

	public updateTurnEnd() {
		this.startInput();
	}
}

export interface BattleManager {
	_phase: 'init' | 'start' | 'input' | 'turn' | 'action' | 'turnEnd' | 'battleEnd' | 'aborting' | 'waiting' | null;
	_canEscape: boolean;
	_canLose: boolean;
	_battleTest: boolean;
	_eventCallback: ((args: any) => any) | null;
	_inputting: boolean;
	_preemptive: boolean;
	_surprise: boolean;
	_hunterIndex: number;
	_actionForcedBattler: Battler | null;
	_actionBattlers: Battler[];
	_subject: Battler;
	_action: Action;
	_targets: Battler[];
	_escapeRatio: number;
	_escaped: boolean;
	_rewards: MV.BattleRewards;
	_party: Party;
	_troop: Troop;
}
