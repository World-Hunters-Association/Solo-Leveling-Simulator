import type { MV } from '../MV';

export class SelfSwitches {
	public constructor() {
		this.initialize();
	}

	public clear() {
		this._data = {};
	}

	public initialize() {
		this.clear();
	}

	public onChange() {
		$gameMap.requestRefresh();
	}

	public setValue(key: MV.SelfSwitches[2], value: boolean) {
		if (value) {
			this._data[key] = true;
		} else {
			delete this._data[key];
		}
		this.onChange();
	}

	public value(key: MV.SelfSwitches[2]) {
		return Boolean(this._data[key]);
	}
}

export interface SelfSwitches {
	_data: Record<MV.SelfSwitches[2], boolean>;
}
