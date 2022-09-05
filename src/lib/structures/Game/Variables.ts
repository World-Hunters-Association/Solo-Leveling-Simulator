export class Variables {
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

	public setValue(variableId: number, value: any) {
		if (variableId > 0 && variableId < $dataSystem.variables.length) {
			if (typeof value === 'number') {
				value = Math.floor(value);
			}
			this._data[variableId] = value;
			this.onChange();
		}
	}

	public value(variableId: number) {
		return this._data[variableId] || 0;
	}
}

export interface Variables {
	_data: number[];
}
