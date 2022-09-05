import type { RPG } from '../RPG';
import { Interpreter } from './Interpreter';

export class CommonEvent {
	public constructor(commonEventId: RPG.CommonEvent['id']) {
		this.initialize(commonEventId);
	}

	public event(): RPG.CommonEvent {
		return $dataCommonEvents[this._commonEventId];
	}

	public initialize(commonEventId: RPG.CommonEvent['id']) {
		this._commonEventId = commonEventId;
		this.refresh();
	}

	public isActive(): boolean {
		const event = this.event();
		return event.trigger === 2 && $gameSwitches.value(event.switchId);
	}

	public list(): RPG.EventCommand[] {
		return this.event().list;
	}

	public refresh() {
		if (this.isActive()) {
			if (!this._interpreter) {
				this._interpreter = new Interpreter();
			}
		} else {
			this._interpreter = null;
		}
	}

	public update() {
		if (this._interpreter) {
			if (!this._interpreter.isRunning()) {
				this._interpreter.setup(this.list());
				this._interpreter.setEventInfo({ eventType: 'common_event', commonEventId: this._commonEventId });
			}
			this._interpreter.update();
		}
	}
}

export interface CommonEvent {
	_commonEventId: RPG.CommonEvent['id'];
	_interpreter: Interpreter;
}
