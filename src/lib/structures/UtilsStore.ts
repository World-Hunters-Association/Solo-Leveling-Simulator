import { AliasStore } from '@sapphire/framework';
import type ConstantsUtils from '../../utils/constants';
import { Utils } from './Utils';

export class UtilsStore extends AliasStore<Utils> {
	public constructor() {
		super(Utils as any, { name: 'utils' });
	}

	public async loadAll() {
		await super.loadAll();
		this.forEach((utils, name) => {
			this.container[name as 'constants'] = utils as ConstantsUtils;
		});
	}
}
