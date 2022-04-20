import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { editLocalized } from '@sapphire/plugin-i18next';

import type { CommandInteraction } from 'discord.js';

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
					.addChoices({ name: 'English', value: 'en-US' }, { name: 'Tiếng Việt', value: 'vi-VN' })
			);
		registry.registerChatInputCommand(builder, {
			idHints: ['964369443574665216'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		await this.container.db.collection('language').updateOne(
			{ uid: interaction.user.id },
			{
				$set: {
					language: interaction.options.getString('language', true) as 'en-US'
				}
			}
		);

		await editLocalized(interaction, { keys: 'language:success' });
	}
}
