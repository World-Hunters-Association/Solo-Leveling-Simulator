import type { RPG } from '../RPG';

export class CharacterBase {
	public constructor() {
		this.initialize();
	}

	public get x() {
		return this._x;
	}

	public get y() {
		return this._y;
	}

	public animationWait(): number {
		return (9 - this.realMoveSpeed()) * 3;
	}

	public blendMode(): number {
		return this._blendMode;
	}

	public bushDepth(): number {
		return this._bushDepth;
	}

	public canPass(x: number, y: number, d: number): boolean {
		const x2 = $gameMap.roundXWithDirection(x, d);
		const y2 = $gameMap.roundYWithDirection(y, d);
		if (!$gameMap.isValid(x2, y2)) {
			return false;
		}
		if (this.isThrough() || this.isDebugThrough()) {
			return true;
		}
		if (!this.isMapPassable(x, y, d)) {
			return false;
		}
		if (this.isCollidedWithCharacters(x2, y2)) {
			return false;
		}
		return true;
	}

	public canPassDiagonally(x: number, y: number, horz: number, vert: number): boolean {
		const x2 = $gameMap.roundXWithDirection(x, horz);
		const y2 = $gameMap.roundYWithDirection(y, vert);
		if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
			return true;
		}
		if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
			return true;
		}
		return false;
	}

	public characterIndex(): number {
		return this._characterIndex;
	}

	public characterName(): string {
		return this._characterName;
	}

	public checkEventTriggerTouch(x: number, y: number): boolean {
		return false;
	}

	public checkEventTriggerTouchFront(d: number) {
		const x2 = $gameMap.roundXWithDirection(this._x, d);
		const y2 = $gameMap.roundYWithDirection(this._y, d);
		this.checkEventTriggerTouch(x2, y2);
	}

	public checkStop(threshold: number): boolean {
		return this._stopCount > threshold;
	}

	public copyPosition(character: CharacterBase) {
		this._x = character._x;
		this._y = character._y;
		this._realX = character._realX;
		this._realY = character._realY;
		this._direction = character._direction;
	}

	public direction(): number {
		return this._direction;
	}

	public distancePerFrame(): number {
		return Math.pow(2, this.realMoveSpeed()) / 256;
	}

	public endAnimation() {
		this._animationPlaying = false;
	}

	public endBalloon() {
		this._balloonPlaying = false;
	}

	public hasStepAnime(): boolean {
		return this._stepAnime;
	}

	public hasWalkAnime(): boolean {
		return this._walkAnime;
	}

	public increaseSteps() {
		if (this.isOnLadder()) {
			this.setDirection(8);
		}
		this.resetStopCount();
		this.refreshBushDepth();
	}

	public initialize() {
		this.initMembers();
	}

	public initMembers() {
		this._x = 0;
		this._y = 0;
		this._realX = 0;
		this._realY = 0;
		this._moveSpeed = 4;
		this._moveFrequency = 6;
		this._opacity = 255;
		this._blendMode = 0;
		this._direction = 2;
		this._pattern = 1;
		this._priorityType = 1;
		this._tileId = 0;
		this._characterName = '';
		this._characterIndex = 0;
		this._isObjectCharacter = false;
		this._walkAnime = true;
		this._stepAnime = false;
		this._directionFix = false;
		this._through = false;
		this._transparent = false;
		this._bushDepth = 0;
		this._animationId = 0;
		this._balloonId = 0;
		this._animationPlaying = false;
		this._balloonPlaying = false;
		this._animationCount = 0;
		this._stopCount = 0;
		this._jumpCount = 0;
		this._jumpPeak = 0;
		this._movementSuccess = true;
	}

	public isAnimationPlaying(): boolean {
		return this._animationId > 0 || this._animationPlaying;
	}

	public isBalloonPlaying(): boolean {
		return this._balloonId > 0 || this._balloonPlaying;
	}

	public isCollidedWithCharacters(x: number, y: number): boolean {
		return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
	}

	public isCollidedWithEvents(x: number, y: number): boolean {
		const events = $gameMap.eventsXyNt(x, y);
		return events.some(function (event) {
			return event.isNormalPriority();
		});
	}

	public isCollidedWithVehicles(x: number, y: number): boolean {
		return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
	}

	public isDashing(): boolean {
		return false;
	}

	public isDebugThrough(): boolean {
		return false;
	}

	public isDirectionFixed(): boolean {
		return this._directionFix;
	}

	public isJumping(): boolean {
		return this._jumpCount > 0;
	}

	public isMapPassable(x: number, y: number, d: number): boolean {
		const x2 = $gameMap.roundXWithDirection(x, d);
		const y2 = $gameMap.roundYWithDirection(y, d);
		const d2 = this.reverseDir(d);
		return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
	}

	public isMovementSucceeded(x?: number, y?: number): boolean {
		return this._movementSuccess;
	}

	public isMoving(): boolean {
		return this._realX !== this._x || this._realY !== this._y;
	}

	public isNearTheScreen(): boolean {
		const gw = Graphics.width;
		const gh = Graphics.height;
		const tw = $gameMap.tileWidth();
		const th = $gameMap.tileHeight();
		const px = this.scrolledX() * tw + tw / 2 - gw / 2;
		const py = this.scrolledY() * th + th / 2 - gh / 2;
		return px >= -gw && px <= gw && py >= -gh && py <= gh;
	}

	public isNormalPriority(): boolean {
		return this._priorityType === 1;
	}

	public isObjectCharacter(): boolean {
		return this._isObjectCharacter;
	}

	public isOnBush(): boolean {
		return $gameMap.isBush(this._x, this._y);
	}

	public isOnLadder(): boolean {
		return $gameMap.isLadder(this._x, this._y);
	}

	public isOriginalPattern(): boolean {
		return this.pattern() === 1;
	}

	public isStopping(): boolean {
		return !this.isMoving() && !this.isJumping();
	}

	public isThrough(): boolean {
		return this._through;
	}

	public isTile(): boolean {
		return this._tileId > 0 && this._priorityType === 0;
	}

	public isTransparent(): boolean {
		return this._transparent;
	}

	public jump(xPlus: number, yPlus: number) {
		if (Math.abs(xPlus) > Math.abs(yPlus)) {
			if (xPlus !== 0) {
				this.setDirection(xPlus < 0 ? 4 : 6);
			}
		} else if (yPlus !== 0) {
			this.setDirection(yPlus < 0 ? 8 : 2);
		}
		this._x += xPlus;
		this._y += yPlus;
		const distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
		this._jumpPeak = 10 + distance - this._moveSpeed;
		this._jumpCount = this._jumpPeak * 2;
		this.resetStopCount();
		this.straighten();
	}

	public jumpHeight(): number {
		return (this._jumpPeak * this._jumpPeak - Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) / 2;
	}

	public locate(x: number, y: number) {
		this.setPosition(x, y);
		this.straighten();
		this.refreshBushDepth();
	}

	public maxPattern(): number {
		return 4;
	}

	public moveDiagonally(horz: number, vert: number) {
		this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
		if (this.isMovementSucceeded()) {
			this._x = $gameMap.roundXWithDirection(this._x, horz);
			this._y = $gameMap.roundYWithDirection(this._y, vert);
			this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
			this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
			this.increaseSteps();
		}
		if (this._direction === this.reverseDir(horz)) {
			this.setDirection(horz);
		}
		if (this._direction === this.reverseDir(vert)) {
			this.setDirection(vert);
		}
	}

	public moveFrequency(): number {
		return this._moveFrequency;
	}

	public moveSpeed(): number {
		return this._moveSpeed;
	}

	public moveStraight(d: number) {
		this.setMovementSuccess(this.canPass(this._x, this._y, d));
		if (this.isMovementSucceeded()) {
			this.setDirection(d);
			this._x = $gameMap.roundXWithDirection(this._x, d);
			this._y = $gameMap.roundYWithDirection(this._y, d);
			this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
			this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
			this.increaseSteps();
		} else {
			this.setDirection(d);
			this.checkEventTriggerTouchFront(d);
		}
	}

	public opacity(): number {
		return this._opacity;
	}

	public pattern(): number {
		return this._pattern < 3 ? this._pattern : 1;
	}

	public pos(x: number, y: number): boolean {
		return this._x === x && this._y === y;
	}

	public posNt(x: number, y: number): boolean {
		// No through
		return this.pos(x, y) && !this.isThrough();
	}

	public realMoveSpeed(): number {
		return this._moveSpeed + (this.isDashing() ? 1 : 0);
	}

	public refreshBushDepth() {
		if (this.isNormalPriority() && !this.isObjectCharacter() && this.isOnBush() && !this.isJumping()) {
			if (!this.isMoving()) {
				this._bushDepth = 12;
			}
		} else {
			this._bushDepth = 0;
		}
	}

	public regionId(): number {
		return $gameMap.regionId(this._x, this._y);
	}

	public resetPattern() {
		this.setPattern(1);
	}

	public resetStopCount() {
		this._stopCount = 0;
	}

	public reverseDir(d: number): number {
		return 10 - d;
	}

	public screenX(): number {
		const tw = $gameMap.tileWidth();
		return Math.round(this.scrolledX() * tw + tw / 2);
	}

	public screenY(): number {
		const th = $gameMap.tileHeight();
		return Math.round(this.scrolledY() * th + th - this.shiftY() - this.jumpHeight());
	}

	public screenZ(): number {
		return this._priorityType * 2 + 1;
	}

	public scrolledX(): number {
		return $gameMap.adjustX(this._realX);
	}

	public scrolledY(): number {
		return $gameMap.adjustY(this._realY);
	}

	public setBlendMode(blendMode: number) {
		this._blendMode = blendMode;
	}

	public setDirection(d: number) {
		if (!this.isDirectionFixed() && d) {
			this._direction = d;
		}
		this.resetStopCount();
	}

	public setDirectionFix(directionFix: boolean) {
		this._directionFix = directionFix;
	}

	public setImage(characterName: string, characterIndex: number) {
		this._tileId = 0;
		this._characterName = characterName;
		this._characterIndex = characterIndex;
		this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
	}

	public setMoveFrequency(moveFrequency: number) {
		this._moveFrequency = moveFrequency;
	}

	public setMovementSuccess(success: boolean) {
		this._movementSuccess = success;
	}

	public setMoveSpeed(moveSpeed: number) {
		this._moveSpeed = moveSpeed;
	}

	public setOpacity(opacity: number) {
		this._opacity = opacity;
	}

	public setPattern(pattern: number) {
		this._pattern = pattern;
	}

	public setPosition(x: number, y: number) {
		this._x = Math.round(x);
		this._y = Math.round(y);
		this._realX = x;
		this._realY = y;
	}

	public setPriorityType(priorityType: CharacterBase.Priority) {
		this._priorityType = priorityType;
	}

	public setStepAnime(stepAnime: boolean) {
		this._stepAnime = stepAnime;
	}

	public setThrough(through: boolean) {
		this._through = through;
	}

	public setTileImage(tileId: number) {
		this._tileId = tileId;
		this._characterName = '';
		this._characterIndex = 0;
		this._isObjectCharacter = true;
	}

	public setTransparent(transparent: boolean) {
		this._transparent = transparent;
	}

	public setWalkAnime(walkAnime: boolean) {
		this._walkAnime = walkAnime;
	}

	public shiftY(): number {
		return this.isObjectCharacter() ? 0 : 6;
	}

	public startAnimation() {
		this._animationId = 0;
		this._animationPlaying = true;
	}

	public startBalloon() {
		this._balloonId = 0;
		this._balloonPlaying = true;
	}

	public straighten() {
		if (this.hasWalkAnime() || this.hasStepAnime()) {
			this._pattern = 1;
		}
		this._animationCount = 0;
	}

	public terrainTag(): number {
		return $gameMap.terrainTag(this._x, this._y);
	}

	public tileId() {
		return this._tileId;
	}

	public update() {
		if (this.isStopping()) {
			this.updateStop();
		}
		if (this.isJumping()) {
			this.updateJump();
		} else if (this.isMoving()) {
			this.updateMove();
		}
		this.updateAnimation();
	}

	public updateAnimation() {
		this.updateAnimationCount();
		if (this._animationCount >= this.animationWait()) {
			this.updatePattern();
			this._animationCount = 0;
		}
	}

	public updateAnimationCount() {
		if (this.isMoving() && this.hasWalkAnime()) {
			this._animationCount += 1.5;
		} else if (this.hasStepAnime() || !this.isOriginalPattern()) {
			this._animationCount++;
		}
	}

	public updateJump() {
		this._jumpCount--;
		this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
		this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
		this.refreshBushDepth();
		if (this._jumpCount === 0) {
			this._realX = this._x;
			this._x = $gameMap.roundX(this._x);
			this._realY = this._y;
			this._y = $gameMap.roundY(this._y);
		}
	}

	public updateMove() {
		if (this._x < this._realX) {
			this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
		}
		if (this._x > this._realX) {
			this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
		}
		if (this._y < this._realY) {
			this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
		}
		if (this._y > this._realY) {
			this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
		}
		if (!this.isMoving()) {
			this.refreshBushDepth();
		}
	}

	public updatePattern() {
		if (!this.hasStepAnime() && this._stopCount > 0) {
			this.resetPattern();
		} else {
			this._pattern = (this._pattern + 1) % this.maxPattern();
		}
	}

	public updateStop() {
		this._stopCount++;
	}
}

export interface CharacterBase {
	x: number;
	y: number;
	_x: number;
	_y: number;
	_realX: number;
	_realY: number;
	_moveSpeed: number;
	_moveFrequency: number;
	_opacity: number;
	_blendMode: number;
	_direction: number;
	_pattern: number;
	_priorityType: RPG.EventPage.Priority;
	_tileId: number;
	_characterName: string;
	_characterIndex: number;
	_isObjectCharacter: boolean;
	_walkAnime: boolean;
	_stepAnime: boolean;
	_directionFix: boolean;
	_through: boolean;
	_transparent: boolean;
	_bushDepth: number;
	_animationId: number;
	_balloonId: number;
	_animationPlaying: boolean;
	_balloonPlaying: boolean;
	_animationCount: number;
	_stopCount: number;
	_jumpCount: number;
	_jumpPeak: number;
	_movementSuccess: boolean;
}
