import { Collection, MessageEmbed, SelectMenuInteraction } from 'discord.js';

import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerOptions, InteractionHandlerTypes } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';

@ApplyOptions<InteractionHandlerOptions>({
	interactionHandlerType: InteractionHandlerTypes.SelectMenu
})
export class ButtonInteractionHandler extends InteractionHandler {
	public override async parse(interaction: SelectMenuInteraction) {
		if (interaction.customId !== `Help:CATEGORY:${interaction.user.id}`) return this.none();
		await interaction.deferUpdate();
		return this.some();
	}

	public override async run(interaction: SelectMenuInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		const embed = new MessageEmbed({
			footer: { text: await resolveKey(interaction, 'validation:help.defaultEmbed.footer', { lng: locale }) }
		}).setColor('BLUE');

		const coll = new Collection<string, { [key: string]: string }>(
			Object.entries(this.container.constants.COMMANDS.HELP[interaction.values[0] as 'STATISTICS'])
		);

		await interaction.editReply({
			embeds: [
				embed
					.addFields(
						await Promise.all(
							coll.map(async (_val, key) => ({
								name: key.toLowerCase().replace(/^\w/, (l) => l.toUpperCase()),
								value: await resolveKey(interaction, `validation:help.desccriptions.commands.${key}`, { lng: locale })
							}))
						)
					)
					.setTitle(interaction.values[0])
			]
		});
	}
}

declare module '@sapphire/framework' {
	interface InteractionHandlerStore {
		get(name: 'category'): ButtonInteractionHandler;
	}
}
