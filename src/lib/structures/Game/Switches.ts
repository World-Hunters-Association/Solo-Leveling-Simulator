export class Switches {
	public constructor() {
		this.initialize();
	}

	public clear() {
		this._data = [];
	}

	public initialize() {
		this.clear();
	}

	public onChange() {
		$gameMap.requestRefresh();
	}

	public setValue(switchId: number, value: boolean) {
		if (switchId > 0 && switchId < $dataSystem.switches.length) {
			this._data[switchId] = value;
			this.onChange();
		}
	}

	public value(switchId: number) {
		return Boolean(this._data[switchId]);
	}
}

export interface Switches {
	_data: boolean[];
}
