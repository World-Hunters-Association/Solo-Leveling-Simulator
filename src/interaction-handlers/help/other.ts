import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerOptions, InteractionHandlerTypes } from '@sapphire/framework';

import type { SelectMenuInteraction } from 'discord.js';
import type HelpCommand from '../../commands/general/help';

@ApplyOptions<InteractionHandlerOptions>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class SelectMenuInteractionHandler extends InteractionHandler {
	public override async parse(interaction: SelectMenuInteraction) {
		if (interaction.customId !== `Help:COMMANDS:${interaction.user.id}`) return this.none();
		await interaction.deferUpdate();
		return this.some();
	}

	public override async run(interaction: SelectMenuInteraction) {
		await (this.container.stores.get('commands').get('help') as HelpCommand).chatInputRun(interaction);
	}
}
