import { PieceContext, Precondition } from '@sapphire/framework';

import type { CommandInteraction } from 'discord.js';

export default class IsHunterPrecondition extends Precondition {
	public constructor(context: PieceContext, options: Precondition.Options) {
		super(context, {
			...options,
			name: 'IsHunter'
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		if (!(await this.container.db.collection('hunterinfo').countDocuments({ uid: interaction.user.id }))) return this.error();
		return this.ok();
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		IsHunter: never;
	}
}
