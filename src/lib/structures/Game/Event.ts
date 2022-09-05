import { Character } from './Character';

import { RPG } from '../RPG';
import { Interpreter } from './Interpreter';

export class Event extends Character {
	public constructor() {
		super();
		this.initialize();
	}

	public checkEventTriggerAuto() {
		if (this._trigger === 3) {
			this.start();
		}
	}

	public checkEventTriggerTouch(x: number, y: number) {
		if (!$gameMap.isEventRunning()) {
			if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
				if (!this.isJumping() && this.isNormalPriority()) {
					this.start();
				}
			}
		}
	}

	public clearPageSettings() {
		this.setImage('', 0);
		this._moveType = 0;
		this._trigger = null;
		this._interpreter = null;
		this.setThrough(true);
	}

	public clearStartingFlag() {
		this._starting = false;
	}

	public erase() {
		this._erased = true;
		this.refresh();
	}

	public event(): RPG.Event {
		return $dataMap.events[this._eventId];
	}

	public eventId(): number {
		return this._eventId;
	}

	public findProperPageIndex(): number {
		const { pages } = this.event();
		for (let i = pages.length - 1; i >= 0; i--) {
			const page = pages[i];
			if (this.meetsConditions(page)) {
				return i;
			}
		}
		return -1;
	}

	// public findMeta(metaNames: string | string[]): any // static

	public forceMoveRoute(moveRoute: RPG.MoveRoute) {
		super.forceMoveRoute(moveRoute);
		this._prelockDirection = 0;
	}

	public initialize() {
		super.initialize();
		this._mapId = mapId;
		this._eventId = eventId;
		this.locate(this.event().x, this.event().y);
		this.refresh();
	}

	public initMembers() {
		super.initMembers();
		this._moveType = 0;
		this._trigger = 0;
		this._starting = false;
		this._erased = false;
		this._pageIndex = -2;
		this._originalPattern = 1;
		this._originalDirection = 2;
		this._prelockDirection = 0;
		this._locked = false;
	}

	public isCollidedWithCharacters(x: number, y: number): boolean {
		return super.isCollidedWithCharacters(x, y) || this.isCollidedWithPlayerCharacters(x, y);
	}

	public isCollidedWithEvents(x: number, y: number): boolean {
		const events = $gameMap.eventsXyNt(x, y);
		return events.length > 0;
	}

	public isCollidedWithPlayerCharacters(x: number, y: number): boolean {
		return this.isNormalPriority() && $gamePlayer.isCollided(x, y);
	}

	public isNearThePlayer(): boolean {
		const sx = Math.abs(this.deltaXFrom($gamePlayer.x));
		const sy = Math.abs(this.deltaYFrom($gamePlayer.y));
		return sx + sy < 20;
	}

	public isOriginalPattern(): boolean {
		return this.pattern() === this._originalPattern;
	}

	public isStarting(): boolean {
		return this._starting;
	}

	public isTriggerIn(triggers: RPG.EventPage.Trigger[]): boolean {
		return triggers.contains(this._trigger);
	}

	public list(): RPG.EventCommand[] {
		return this.page().list;
	}

	public locate(x: number, y: number) {
		super.locate(x, y);
		this._prelockDirection = 0;
	}

	public lock() {
		if (!this._locked) {
			this._prelockDirection = this.direction();
			this.turnTowardPlayer();
			this._locked = true;
		}
	}

	public meetsConditions(page: RPG.EventPage): boolean {
		const c = page.conditions;
		if (c.switch1Valid) {
			if (!$gameSwitches.value(c.switch1Id)) {
				return false;
			}
		}
		if (c.switch2Valid) {
			if (!$gameSwitches.value(c.switch2Id)) {
				return false;
			}
		}
		if (c.variableValid) {
			if ($gameVariables.value(c.variableId) < c.variableValue) {
				return false;
			}
		}
		if (c.selfSwitchValid) {
			const key = [this._mapId, this._eventId, c.selfSwitchCh];
			if ($gameSelfSwitches.value(key) !== true) {
				return false;
			}
		}
		if (c.itemValid) {
			const item = $dataItems[c.itemId];
			if (!$gameParty.hasItem(item)) {
				return false;
			}
		}
		if (c.actorValid) {
			const actor = $gameActors.actor(c.actorId);
			if (!$gameParty.members().contains(actor)) {
				return false;
			}
		}
		return true;
	}

	public moveTypeCustom() {
		this.updateRoutineMove();
	}

	public moveTypeRandom() {
		switch (Math.randomInt(6)) {
			case 0:
			case 1:
				this.moveRandom();
				break;
			case 2:
			case 3:
			case 4:
				this.moveForward();
				break;
			case 5:
				this.resetStopCount();
				break;
		}
	}

	public moveTypeTowardPlayer() {
		if (this.isNearThePlayer()) {
			switch (Math.randomInt(6)) {
				case 0:
				case 1:
				case 2:
				case 3:
					this.moveTowardPlayer();
					break;
				case 4:
					this.moveRandom();
					break;
				case 5:
					this.moveForward();
					break;
			}
		} else {
			this.moveRandom();
		}
	}

	public page(): RPG.EventPage {
		return this.event().pages[this._pageIndex];
	}

	public refresh() {
		const newPageIndex = this._erased ? -1 : this.findProperPageIndex();
		if (this._pageIndex !== newPageIndex) {
			this._pageIndex = newPageIndex;
			this.setupPage();
		}
	}

	public resetPattern() {
		this.setPattern(this._originalPattern);
	}

	public setupPage() {
		if (this._pageIndex >= 0) {
			this.setupPageSettings();
		} else {
			this.clearPageSettings();
		}
		this.refreshBushDepth();
		this.clearStartingFlag();
		this.checkEventTriggerAuto();
	}

	public setupPageSettings() {
		const page = this.page();
		const { image } = page;
		if (image.tileId > 0) {
			this.setTileImage(image.tileId);
		} else {
			this.setImage(image.characterName, image.characterIndex);
		}
		if (this._originalDirection !== image.direction) {
			this._originalDirection = image.direction;
			this._prelockDirection = 0;
			this.setDirectionFix(false);
			this.setDirection(image.direction);
		}
		if (this._originalPattern !== image.pattern) {
			this._originalPattern = image.pattern;
			this.setPattern(image.pattern);
		}
		this.setMoveSpeed(page.moveSpeed);
		this.setMoveFrequency(page.moveFrequency);
		this.setPriorityType(page.priorityType);
		this.setWalkAnime(page.walkAnime);
		this.setStepAnime(page.stepAnime);
		this.setDirectionFix(page.directionFix);
		this.setThrough(page.through);
		this.setMoveRoute(page.moveRoute);
		this._moveType = page.moveType;
		this._trigger = page.trigger;
		if (this._trigger === 4) {
			this._interpreter = new Interpreter();
		} else {
			this._interpreter = null;
		}
	}

	public start() {
		const list = this.list();
		if (list && list.length > 1) {
			this._starting = true;
			if (this.isTriggerIn([0, 1, 2])) {
				this.lock();
			}
		}
	}

	public stopCountThreshold(): number {
		return 30 * (5 - this.moveFrequency());
	}

	public unlock() {
		if (this._locked) {
			this._locked = false;
			this.setDirection(this._prelockDirection);
		}
	}

	public update() {
		super.update();
		this.checkEventTriggerAuto();
		this.updateParallel();
	}

	public updateParallel() {
		if (this._interpreter) {
			if (!this._interpreter.isRunning()) {
				this._interpreter.setup(this.list(), this._eventId);
				this._interpreter.setEventInfo(this.getEventInfo());
			}
			this._interpreter.update();
		}
	}

	public updateSelfMovement() {
		if (!this._locked && this.isNearTheScreen() && this.checkStop(this.stopCountThreshold())) {
			switch (this._moveType) {
				case RPG.EventPage.MoveType.Random:
					this.moveTypeRandom();
					break;
				case RPG.EventPage.MoveType.Approach:
					this.moveTypeTowardPlayer();
					break;
				case RPG.EventPage.MoveType.Custom:
					this.moveTypeCustom();
					break;
			}
		}
	}

	public updateStop() {
		if (this._locked) {
			this.resetStopCount();
		}
		super.updateStop();
		if (!this.isMoveRouteForcing()) {
			this.updateSelfMovement();
		}
	}
}

export interface Event {
	_mapId: number;
	_eventId: number;
	_moveType: RPG.EventPage.MoveType;
	_trigger: RPG.EventPage.Trigger;
	_starting: boolean;
	_erased: boolean;
	_pageIndex: number;
	_originalPattern: number;
	_originalDirection: number;
	_prelockDirection: number;
	_locked: boolean;
	_interpreter: Interpreter;
}
