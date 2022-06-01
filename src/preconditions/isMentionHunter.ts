import { PieceContext, Precondition } from '@sapphire/framework';

import type { CommandInteraction } from 'discord.js';

export default class UserPrecondition extends Precondition {
	public constructor(context: PieceContext, options: Precondition.Options) {
		super(context, {
			...options,
			name: 'IsMentionHunter'
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const user = interaction.options.getUser(this.container.i18n.format('en-US', 'common:hunter').toLowerCase());
		if (!user) return this.ok();
		if (!(await this.container.db.collection('hunterinfo').countDocuments({ uid: user?.id }))) return this.error({ context: { user } });
		return this.ok();
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		IsMentionHunter: never;
	}

	interface PreconditionStore {
		get(name: 'IsMentionHunter'): UserPrecondition;
	}
}
