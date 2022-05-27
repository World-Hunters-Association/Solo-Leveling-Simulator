import { CommandInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';

import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { editLocalized } from '@sapphire/plugin-i18next';

import { EMOJIS } from '../../lib/constants';

@ApplyOptions<CommandOptions>({
	name: 'language',
	description: 'Language configuration',
	preconditions: ['EphemeralDefer', 'IsHunter'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class LanguageCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addStringOption(
				new SlashCommandStringOption()
					.setName('language')
					.setDescription('Language configuration')
					.setRequired(true)
					.addChoices(
						{ name: 'English', value: 'en-US' },
						{ name: 'Tiếng Việt', value: 'vi' },
						{ name: 'Bahasa Indonesia', value: 'id-ID' }
					)
			);
		registry.registerChatInputCommand(builder, {
			idHints: ['964369443574665216'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const staffLanguages = ['en-US', 'vi', 'id-ID'];

		const language = interaction.options.getString('language', true) as 'en-US';

		const changeLang = async () => {
			await this.container.db.collection('language').updateOne({ uid: interaction.user.id }, { $set: { language } });

			await editLocalized(interaction, { keys: 'validation:language.success' });
		};

		if (staffLanguages.includes(language)) await changeLang();
		else {
			const locale = (await this.container.i18n.fetchLanguage(interaction)) || 'en-US';
			let components = [
				new MessageActionRow().setComponents([
					new MessageButton()
						.setCustomId(`Yes`)
						.setLabel(this.container.i18n.getT(locale)('common:yes'))
						.setStyle('SECONDARY')
						.setEmoji(EMOJIS.UI.YES),
					new MessageButton()
						.setCustomId(`No`)
						.setLabel(this.container.i18n.getT(locale)('common:no'))
						.setStyle('PRIMARY')
						.setEmoji(EMOJIS.UI.CANCEL)
				])
			];

			const message = await editLocalized(interaction, { keys: 'validation:language.disclaimer', components, fetchReply: true });

			components = components.map((row) => {
				row.components = row.components.map((button) => button.setDisabled(true));
				return row;
			});

			const collector = (message as Message).createMessageComponentCollector({
				filter: (i) => i.user.id === interaction.user.id,
				time: 30000,
				max: 1
			});

			collector.on('collect', async (i) => {
				await i.deferUpdate();
				switch (i.customId) {
					case 'Yes':
						await changeLang();
						break;
					case 'No':
						await editLocalized(i, { keys: 'validation:language.decline', components });
				}
			});

			collector.on('end', async (_collected, reason) => {
				if (reason === 'time') await editLocalized(interaction, { keys: 'common:timeout', components });
			});
		}
	}
}
