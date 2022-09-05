import type { RPG } from '../RPG';

export class Item {
	public constructor(item?: RPG.BaseItem) {
		this.initialize(item);
	}

	public initialize(item?: RPG.BaseItem): void {
		this._dataClass = 'none';
		this._itemId = 0;
		if (item) {
			this.setObject(item);
		}
	}

	public isArmor(): boolean {
		return this._dataClass === 'Armor';
	}

	public isEquipItem(): boolean {
		return this.isWeapon() || this.isArmor();
	}

	public isItem(): boolean {
		return this._dataClass === 'Item';
	}

	public isNull(): boolean {
		return this._dataClass === 'none';
	}

	public isSkill(): boolean {
		return this._dataClass === 'Skill';
	}

	public isUsableItem(): boolean {
		return this.isSkill() || this.isItem();
	}

	public isWeapon(): boolean {
		return this._dataClass === 'Weapon';
	}

	public itemId(): number {
		return this._itemId;
	}

	public object(): RPG.BaseItem | undefined {
		if (this.isSkill()) {
			return $dataSkills[this._itemId];
		} else if (this.isItem()) {
			return $dataItems[this._itemId];
		} else if (this.isWeapon()) {
			return $dataWeapons[this._itemId];
		} else if (this.isArmor()) {
			return $dataArmors[this._itemId];
		}
		return undefined;
	}

	public setEquip(isWeapon: boolean, itemId: RPG.EquipItem['id']): void {
		this._dataClass = isWeapon ? 'Weapon' : 'Armor';
		this._itemId = itemId;
	}

	public setObject(item: RPG.BaseItem | null): void {
		if (DataManager.isSkill(item)) {
			this._dataClass = 'Skill';
		} else if (DataManager.isItem(item)) {
			this._dataClass = 'Item';
		} else if (DataManager.isWeapon(item)) {
			this._dataClass = 'Weapon';
		} else if (DataManager.isArmor(item)) {
			this._dataClass = 'Armor';
		} else {
			this._dataClass = 'none';
		}
		this._itemId = item ? item.id : 0;
	}
}

export interface Item {
	_dataClass: RPG.BaseItem.DataClass;
	_itemId: number;
}
