import { PieceContext, Precondition } from '@sapphire/framework';

import type { CommandInteraction, ContextMenuInteraction } from 'discord.js';

export default class EphemeralDeferPrecondition extends Precondition {
	public constructor(context: PieceContext, options: Precondition.Options) {
		super(context, {
			...options,
			name: 'EphemeralDefer'
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: true });
		return this.ok();
	}

	public async contextMenuRun(interaction: ContextMenuInteraction) {
		await interaction.deferReply({ ephemeral: true });
		return this.ok();
	}

	public async messageRun() {
		return this.ok();
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		EphemeralDefer: never;
	}
}
