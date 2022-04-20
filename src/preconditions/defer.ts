import { PieceContext, Precondition } from '@sapphire/framework';

import type { CommandInteraction, ContextMenuInteraction } from 'discord.js';

export default class DeferPrecondition extends Precondition {
	public constructor(context: PieceContext, options: Precondition.Options) {
		super(context, {
			...options,
			name: 'Defer'
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply();
		return this.ok();
	}

	public async contextMenuRun(interaction: ContextMenuInteraction) {
		await interaction.deferReply();
		return this.ok();
	}

	public async messageRun() {
		return this.ok();
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		Defer: never;
	}
}
