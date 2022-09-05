import { RPG } from '../RPG';
import { CharacterBase } from './CharacterBase';

export class Character extends CharacterBase {
	public constructor() {
		super();
		this.initialize();
	}

	public advanceMoveRouteIndex() {
		const moveRoute = this._moveRoute;
		if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
			const numCommands = moveRoute.list.length - 1;
			this._moveRouteIndex++;
			if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
				this._moveRouteIndex = 0;
			}
		}
	}

	public deltaXFrom(x: number): number {
		return $gameMap.deltaX(this.x, x);
	}

	public deltaYFrom(y: number): number {
		return $gameMap.deltaY(this.y, y);
	}

	public findDirectionTo<node extends { parent: node | null } & Record<'x' | 'y' | 'g' | 'f', number>>(goalX: number, goalY: number): number {
		const searchLimit = this.searchLimit();
		const mapWidth = $gameMap.width();
		const nodeList: node[] = [];
		const openList = [];
		const closedList = [];
		const start = {} as node;
		let best = start;

		if (this.x === goalX && this.y === goalY) {
			return 0;
		}

		start.parent = null;
		start.x = this.x;
		start.y = this.y;
		start.g = 0;
		start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
		nodeList.push(start);
		openList.push(start.y * mapWidth + start.x);

		while (nodeList.length > 0) {
			let bestIndex = 0;
			for (let i = 0; i < nodeList.length; i++) {
				if (nodeList[i].f < nodeList[bestIndex].f) {
					bestIndex = i;
				}
			}

			const current = nodeList[bestIndex];
			const x1 = current.x;
			const y1 = current.y;
			const pos1 = y1 * mapWidth + x1;
			const g1 = current.g;

			nodeList.splice(bestIndex, 1);
			openList.splice(openList.indexOf(pos1), 1);
			closedList.push(pos1);

			if (current.x === goalX && current.y === goalY) {
				best = current;
				break;
			}

			if (g1 >= searchLimit) {
				continue;
			}

			for (let j = 0; j < 4; j++) {
				const direction = 2 + j * 2;
				const x2 = $gameMap.roundXWithDirection(x1, direction);
				const y2 = $gameMap.roundYWithDirection(y1, direction);
				const pos2 = y2 * mapWidth + x2;

				if (closedList.contains(pos2)) {
					continue;
				}
				if (!this.canPass(x1, y1, direction)) {
					continue;
				}

				const g2 = g1 + 1;
				const index2 = openList.indexOf(pos2);

				if (index2 < 0 || g2 < nodeList[index2].g) {
					let neighbor: node;
					if (index2 >= 0) {
						neighbor = nodeList[index2];
					} else {
						neighbor = {} as node;
						nodeList.push(neighbor);
						openList.push(pos2);
					}
					neighbor.parent = current;
					neighbor.x = x2;
					neighbor.y = y2;
					neighbor.g = g2;
					neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
					if (!best || neighbor.f - neighbor.g < best.f - best.g) {
						best = neighbor;
					}
				}
			}
		}

		let node = best;
		while (node.parent && node.parent !== start) {
			node = node.parent;
		}

		const deltaX1 = $gameMap.deltaX(node.x, start.x);
		const deltaY1 = $gameMap.deltaY(node.y, start.y);
		if (deltaY1 > 0) {
			return 2;
		} else if (deltaX1 < 0) {
			return 4;
		} else if (deltaX1 > 0) {
			return 6;
		} else if (deltaY1 < 0) {
			return 8;
		}

		const deltaX2 = this.deltaXFrom(goalX);
		const deltaY2 = this.deltaYFrom(goalY);
		if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
			return deltaX2 > 0 ? 4 : 6;
		} else if (deltaY2 !== 0) {
			return deltaY2 > 0 ? 8 : 2;
		}

		return 0;
	}

	public forceMoveRoute(moveRoute: RPG.MoveRoute) {
		if (!this._originalMoveRoute) {
			this.memorizeMoveRoute();
		}
		this._moveRoute = moveRoute;
		this._moveRouteIndex = 0;
		this._moveRouteForcing = true;
		this._waitCount = 0;
	}

	public initialize() {
		super.initialize();
	}

	public initMembers() {
		super.initMembers();
		this._moveRouteForcing = false;
		this._moveRoute = null as unknown as RPG.MoveRoute;
		this._moveRouteIndex = 0;
		this._originalMoveRoute = null as unknown as RPG.MoveRoute;
		this._originalMoveRouteIndex = 0;
		this._waitCount = 0;
		// this._callerEventInfo = null;
	}

	public isMoveRouteForcing(): boolean {
		return this._moveRouteForcing;
	}

	public memorizeMoveRoute() {
		this._originalMoveRoute = this._moveRoute;
		this._originalMoveRouteIndex = this._moveRouteIndex;
	}

	public moveAwayFromCharacter(character: Character) {
		const sx = this.deltaXFrom(character.x);
		const sy = this.deltaYFrom(character.y);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.moveStraight(sx > 0 ? 6 : 4);
			if (!this.isMovementSucceeded() && sy !== 0) {
				this.moveStraight(sy > 0 ? 2 : 8);
			}
		} else if (sy !== 0) {
			this.moveStraight(sy > 0 ? 2 : 8);
			if (!this.isMovementSucceeded() && sx !== 0) {
				this.moveStraight(sx > 0 ? 6 : 4);
			}
		}
	}

	public moveAwayFromPlayer() {
		this.moveAwayFromCharacter($gamePlayer);
	}

	public moveBackward() {
		const lastDirectionFix = this.isDirectionFixed();
		this.setDirectionFix(true);
		this.moveStraight(this.reverseDir(this.direction()));
		this.setDirectionFix(lastDirectionFix);
	}

	public moveForward() {
		this.moveStraight(this.direction());
	}

	public moveRandom() {
		const d = 2 + Math.randomInt(4) * 2;
		if (this.canPass(this.x, this.y, d)) {
			this.moveStraight(d);
		}
	}

	public moveTowardCharacter(character: Character) {
		const sx = this.deltaXFrom(character.x);
		const sy = this.deltaYFrom(character.y);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.moveStraight(sx > 0 ? 4 : 6);
			if (!this.isMovementSucceeded() && sy !== 0) {
				this.moveStraight(sy > 0 ? 8 : 2);
			}
		} else if (sy !== 0) {
			this.moveStraight(sy > 0 ? 8 : 2);
			if (!this.isMovementSucceeded() && sx !== 0) {
				this.moveStraight(sx > 0 ? 4 : 6);
			}
		}
	}

	public moveTowardPlayer() {
		this.moveTowardCharacter($gamePlayer);
	}

	public processMoveCommand(command: RPG.MoveCommand) {
		const gc = Character;
		const params = command.parameters;
		switch (command.code) {
			case gc.ROUTE_END:
				this.processRouteEnd();
				break;
			case gc.ROUTE_MOVE_DOWN:
				this.moveStraight(2);
				break;
			case gc.ROUTE_MOVE_LEFT:
				this.moveStraight(4);
				break;
			case gc.ROUTE_MOVE_RIGHT:
				this.moveStraight(6);
				break;
			case gc.ROUTE_MOVE_UP:
				this.moveStraight(8);
				break;
			case gc.ROUTE_MOVE_LOWER_L:
				this.moveDiagonally(4, 2);
				break;
			case gc.ROUTE_MOVE_LOWER_R:
				this.moveDiagonally(6, 2);
				break;
			case gc.ROUTE_MOVE_UPPER_L:
				this.moveDiagonally(4, 8);
				break;
			case gc.ROUTE_MOVE_UPPER_R:
				this.moveDiagonally(6, 8);
				break;
			case gc.ROUTE_MOVE_RANDOM:
				this.moveRandom();
				break;
			case gc.ROUTE_MOVE_TOWARD:
				this.moveTowardPlayer();
				break;
			case gc.ROUTE_MOVE_AWAY:
				this.moveAwayFromPlayer();
				break;
			case gc.ROUTE_MOVE_FORWARD:
				this.moveForward();
				break;
			case gc.ROUTE_MOVE_BACKWARD:
				this.moveBackward();
				break;
			case gc.ROUTE_JUMP:
				this.jump(params[0], params[1]);
				break;
			case gc.ROUTE_WAIT:
				this._waitCount = params[0] - 1;
				break;
			case gc.ROUTE_TURN_DOWN:
				this.setDirection(2);
				break;
			case gc.ROUTE_TURN_LEFT:
				this.setDirection(4);
				break;
			case gc.ROUTE_TURN_RIGHT:
				this.setDirection(6);
				break;
			case gc.ROUTE_TURN_UP:
				this.setDirection(8);
				break;
			case gc.ROUTE_TURN_90D_R:
				this.turnRight90();
				break;
			case gc.ROUTE_TURN_90D_L:
				this.turnLeft90();
				break;
			case gc.ROUTE_TURN_180D:
				this.turn180();
				break;
			case gc.ROUTE_TURN_90D_R_L:
				this.turnRightOrLeft90();
				break;
			case gc.ROUTE_TURN_RANDOM:
				this.turnRandom();
				break;
			case gc.ROUTE_TURN_TOWARD:
				this.turnTowardPlayer();
				break;
			case gc.ROUTE_TURN_AWAY:
				this.turnAwayFromPlayer();
				break;
			case gc.ROUTE_SWITCH_ON:
				$gameSwitches.setValue(params[0], true);
				break;
			case gc.ROUTE_SWITCH_OFF:
				$gameSwitches.setValue(params[0], false);
				break;
			case gc.ROUTE_CHANGE_SPEED:
				this.setMoveSpeed(params[0]);
				break;
			case gc.ROUTE_CHANGE_FREQ:
				this.setMoveFrequency(params[0]);
				break;
			case gc.ROUTE_WALK_ANIME_ON:
				this.setWalkAnime(true);
				break;
			case gc.ROUTE_WALK_ANIME_OFF:
				this.setWalkAnime(false);
				break;
			case gc.ROUTE_STEP_ANIME_ON:
				this.setStepAnime(true);
				break;
			case gc.ROUTE_STEP_ANIME_OFF:
				this.setStepAnime(false);
				break;
			case gc.ROUTE_DIR_FIX_ON:
				this.setDirectionFix(true);
				break;
			case gc.ROUTE_DIR_FIX_OFF:
				this.setDirectionFix(false);
				break;
			case gc.ROUTE_THROUGH_ON:
				this.setThrough(true);
				break;
			case gc.ROUTE_THROUGH_OFF:
				this.setThrough(false);
				break;
			case gc.ROUTE_TRANSPARENT_ON:
				this.setTransparent(true);
				break;
			case gc.ROUTE_TRANSPARENT_OFF:
				this.setTransparent(false);
				break;
			case gc.ROUTE_CHANGE_IMAGE:
				this.setImage(params[0], params[1]);
				break;
			case gc.ROUTE_CHANGE_OPACITY:
				this.setOpacity(params[0]);
				break;
			case gc.ROUTE_CHANGE_BLEND_MODE:
				this.setBlendMode(params[0]);
				break;
			case gc.ROUTE_PLAY_SE:
				AudioManager.playSe(params[0]);
				break;
			case gc.ROUTE_SCRIPT:
				try {
					eval(params[0]);
				} catch (error: any) {
					// if (this._callerEventInfo) {
					// 	for (const key in this._callerEventInfo) {
					// 		error[key] = this._callerEventInfo[key];
					// 	}
					// 	error.line += this._moveRouteIndex + 1;
					// 	error.eventCommand = 'set_route_script';
					// 	error.content = command.parameters[0];
					// } else {
					error.eventType = 'map_event';
					error.mapId = this._mapId;
					error.mapEventId = this._eventId;
					error.page = this._pageIndex + 1;
					error.line = this._moveRouteIndex + 1;
					error.eventCommand = 'auto_route_script';
					[error.content] = command.parameters;
					// }
					throw error;
				}
				break;
		}
	}

	public processRouteEnd() {
		if (this._moveRoute.repeat) {
			this._moveRouteIndex = -1;
		} else if (this._moveRouteForcing) {
			this._moveRouteForcing = false;
			this.restoreMoveRoute();
		}
	}

	public restoreMoveRoute() {
		this._moveRoute = this._originalMoveRoute;
		this._moveRouteIndex = this._originalMoveRouteIndex;
		this._originalMoveRoute = null;
		// this._callerEventInfo = null;
	}

	public searchLimit(): number {
		return 12;
	}

	public setMoveRoute(moveRoute: RPG.MoveRoute) {
		this._moveRoute = moveRoute;
		this._moveRouteIndex = 0;
		this._moveRouteForcing = false;
	}

	public swap(character: Character) {
		const newX = character.x;
		const newY = character.y;
		character.locate(this.x, this.y);
		this.locate(newX, newY);
	}

	public turn180() {
		this.setDirection(this.reverseDir(this.direction()));
	}

	public turnAwayFromCharacter(character: Character) {
		const sx = this.deltaXFrom(character.x);
		const sy = this.deltaYFrom(character.y);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.setDirection(sx > 0 ? 6 : 4);
		} else if (sy !== 0) {
			this.setDirection(sy > 0 ? 2 : 8);
		}
	}

	public turnAwayFromPlayer() {
		this.turnAwayFromCharacter($gamePlayer);
	}

	public turnLeft90() {
		switch (this.direction()) {
			case 2:
				this.setDirection(6);
				break;
			case 4:
				this.setDirection(2);
				break;
			case 6:
				this.setDirection(8);
				break;
			case 8:
				this.setDirection(4);
				break;
		}
	}

	public turnRandom() {
		this.setDirection(2 + Math.randomInt(4) * 2);
	}

	public turnRight90() {
		switch (this.direction()) {
			case 2:
				this.setDirection(4);
				break;
			case 4:
				this.setDirection(8);
				break;
			case 6:
				this.setDirection(2);
				break;
			case 8:
				this.setDirection(6);
				break;
		}
	}

	public turnRightOrLeft90() {
		switch (Math.randomInt(2)) {
			case 0:
				this.turnRight90();
				break;
			case 1:
				this.turnLeft90();
				break;
		}
	}

	public turnTowardCharacter(character: Character) {
		const sx = this.deltaXFrom(character.x);
		const sy = this.deltaYFrom(character.y);
		if (Math.abs(sx) > Math.abs(sy)) {
			this.setDirection(sx > 0 ? 4 : 6);
		} else if (sy !== 0) {
			this.setDirection(sy > 0 ? 8 : 2);
		}
	}

	public turnTowardPlayer() {
		this.turnTowardCharacter($gamePlayer);
	}

	public updateRoutineMove() {
		if (this._waitCount > 0) {
			this._waitCount--;
		} else {
			this.setMovementSuccess(true);
			const command = this._moveRoute.list[this._moveRouteIndex];
			if (command) {
				this.processMoveCommand(command);
				this.advanceMoveRouteIndex();
			}
		}
	}

	public updateStop() {
		super.updateStop();
		if (this._moveRouteForcing) {
			this.updateRoutineMove();
		}
	}

	public static ROUTE_END = RPG.MoveCommand.Code.ROUTE_END;
	public static ROUTE_MOVE_DOWN = RPG.MoveCommand.Code.ROUTE_MOVE_DOWN;
	public static ROUTE_MOVE_LEFT = RPG.MoveCommand.Code.ROUTE_MOVE_LEFT;
	public static ROUTE_MOVE_RIGHT = RPG.MoveCommand.Code.ROUTE_MOVE_RIGHT;
	public static ROUTE_MOVE_UP = RPG.MoveCommand.Code.ROUTE_MOVE_UP;
	public static ROUTE_MOVE_LOWER_L = RPG.MoveCommand.Code.ROUTE_MOVE_LOWER_L;
	public static ROUTE_MOVE_LOWER_R = RPG.MoveCommand.Code.ROUTE_MOVE_LOWER_R;
	public static ROUTE_MOVE_UPPER_L = RPG.MoveCommand.Code.ROUTE_MOVE_UPPER_L;
	public static ROUTE_MOVE_UPPER_R = RPG.MoveCommand.Code.ROUTE_MOVE_UPPER_R;
	public static ROUTE_MOVE_RANDOM = RPG.MoveCommand.Code.ROUTE_MOVE_RANDOM;
	public static ROUTE_MOVE_TOWARD = RPG.MoveCommand.Code.ROUTE_MOVE_TOWARD;
	public static ROUTE_MOVE_AWAY = RPG.MoveCommand.Code.ROUTE_MOVE_AWAY;
	public static ROUTE_MOVE_FORWARD = RPG.MoveCommand.Code.ROUTE_MOVE_FORWARD;
	public static ROUTE_MOVE_BACKWARD = RPG.MoveCommand.Code.ROUTE_MOVE_BACKWARD;
	public static ROUTE_JUMP = RPG.MoveCommand.Code.ROUTE_JUMP;
	public static ROUTE_WAIT = RPG.MoveCommand.Code.ROUTE_WAIT;
	public static ROUTE_TURN_DOWN = RPG.MoveCommand.Code.ROUTE_TURN_DOWN;
	public static ROUTE_TURN_LEFT = RPG.MoveCommand.Code.ROUTE_TURN_LEFT;
	public static ROUTE_TURN_RIGHT = RPG.MoveCommand.Code.ROUTE_TURN_RIGHT;
	public static ROUTE_TURN_UP = RPG.MoveCommand.Code.ROUTE_TURN_UP;
	public static ROUTE_TURN_90D_R = RPG.MoveCommand.Code.ROUTE_TURN_90D_R;
	public static ROUTE_TURN_90D_L = RPG.MoveCommand.Code.ROUTE_TURN_90D_L;
	public static ROUTE_TURN_180D = RPG.MoveCommand.Code.ROUTE_TURN_180D;
	public static ROUTE_TURN_90D_R_L = RPG.MoveCommand.Code.ROUTE_TURN_90D_R_L;
	public static ROUTE_TURN_RANDOM = RPG.MoveCommand.Code.ROUTE_TURN_RANDOM;
	public static ROUTE_TURN_TOWARD = RPG.MoveCommand.Code.ROUTE_TURN_TOWARD;
	public static ROUTE_TURN_AWAY = RPG.MoveCommand.Code.ROUTE_TURN_AWAY;
	public static ROUTE_SWITCH_ON = RPG.MoveCommand.Code.ROUTE_SWITCH_ON;
	public static ROUTE_SWITCH_OFF = RPG.MoveCommand.Code.ROUTE_SWITCH_OFF;
	public static ROUTE_CHANGE_SPEED = RPG.MoveCommand.Code.ROUTE_CHANGE_SPEED;
	public static ROUTE_CHANGE_FREQ = RPG.MoveCommand.Code.ROUTE_CHANGE_FREQ;
	public static ROUTE_WALK_ANIME_ON = RPG.MoveCommand.Code.ROUTE_WALK_ANIME_ON;
	public static ROUTE_WALK_ANIME_OFF = RPG.MoveCommand.Code.ROUTE_WALK_ANIME_OFF;
	public static ROUTE_STEP_ANIME_ON = RPG.MoveCommand.Code.ROUTE_STEP_ANIME_ON;
	public static ROUTE_STEP_ANIME_OFF = RPG.MoveCommand.Code.ROUTE_STEP_ANIME_OFF;
	public static ROUTE_DIR_FIX_ON = RPG.MoveCommand.Code.ROUTE_DIR_FIX_ON;
	public static ROUTE_DIR_FIX_OFF = RPG.MoveCommand.Code.ROUTE_DIR_FIX_OFF;
	public static ROUTE_THROUGH_ON = RPG.MoveCommand.Code.ROUTE_THROUGH_ON;
	public static ROUTE_THROUGH_OFF = RPG.MoveCommand.Code.ROUTE_THROUGH_OFF;
	public static ROUTE_TRANSPARENT_ON = RPG.MoveCommand.Code.ROUTE_TRANSPARENT_ON;
	public static ROUTE_TRANSPARENT_OFF = RPG.MoveCommand.Code.ROUTE_TRANSPARENT_OFF;
	public static ROUTE_CHANGE_IMAGE = RPG.MoveCommand.Code.ROUTE_CHANGE_IMAGE;
	public static ROUTE_CHANGE_OPACITY = RPG.MoveCommand.Code.ROUTE_CHANGE_OPACITY;
	public static ROUTE_CHANGE_BLEND_MODE = RPG.MoveCommand.Code.ROUTE_CHANGE_BLEND_MODE;
	public static ROUTE_PLAY_SE = RPG.MoveCommand.Code.ROUTE_PLAY_SE;
	public static ROUTE_SCRIPT = RPG.MoveCommand.Code.ROUTE_SCRIPT;
}

export interface Character {
	_moveRouteForcing: boolean;
	_moveRoute: RPG.MoveRoute;
	_moveRouteIndex: number;
	_originalMoveRoute: RPG.MoveRoute;
	_originalMoveRouteIndex: number;
	_waitCount: number;
}
