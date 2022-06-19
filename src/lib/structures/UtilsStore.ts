import { AliasStore } from '@sapphire/framework';
import { Utils } from './Utils';

export class UtilsStore extends AliasStore<Utils> {
	public constructor() {
		super(Utils as any, { name: 'utils' });
	}
}
