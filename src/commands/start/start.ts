import { CommandInteraction, MessageEmbed } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';

import { EMOJIS } from '../../lib/constants';
import { resolveKey } from '@sapphire/plugin-i18next';

@ApplyOptions<CommandOptions>({
	name: 'start',
	description: 'Show start guide',
	preconditions: ['EphemeralDefer', 'IsHunter'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class StartCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder().setName(this.name).setDescription(this.description);
		registry.registerChatInputCommand(builder, {
			idHints: ['964148504962404462'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const message = new PaginatedMessage({
			template: new MessageEmbed().setColor('BLUE')
		})
			.setActions(
				[
					{
						customId: 'Start:Rule',
						label: await resolveKey(interaction, 'common:rule'),
						style: 'DANGER',
						emoji: EMOJIS.UI.RULE,
						type: 'BUTTON',
						run: () => {
							this.container.applicationCommandRegistries.acquire('rule').command?.chatInputRun!(interaction, {
								commandName: 'rule',
								commandId: ''
							});
						}
					},
					{
						customId: 'Start:Help',
						label: await resolveKey(interaction, 'common:help'),
						style: 'SECONDARY',
						emoji: EMOJIS.UI.HELP,
						type: 'BUTTON',
						run: () => {
							this.container.applicationCommandRegistries.acquire('help').command?.chatInputRun!(interaction, {
								commandName: 'help',
								commandId: ''
							});
						}
					},
					{
						customId: 'Start:Choose class',
						label: await resolveKey(interaction, 'common:chooseClass'),
						style: 'SECONDARY',
						emoji: EMOJIS.UI.CHOOSE_CLASS,
						type: 'BUTTON',
						run: () => {
							this.container.applicationCommandRegistries.acquire('chooseClass').command?.chatInputRun!(interaction, {
								commandName: 'chooseClass',
								commandId: ''
							});
						}
					},
					{
						url: 'https://linktr.ee/mzato0001',
						label: await resolveKey(interaction, 'common:links'),
						style: 'LINK',
						type: 'BUTTON'
					}
				],
				true
			)
			.addPageEmbed((embed) => embed.setImage('https://media.discordapp.net/attachments/914004331525734410/919569139432038410/Welcome.png'))
			.addPageEmbed((embed) => embed.setImage('https://media.discordapp.net/attachments/914004331525734410/914004396331917352/Profile.png'))
			.addPageEmbed((embed) => embed.setImage('https://media.discordapp.net/attachments/914004331525734410/914004396101206026/Party.png'))
			.addPageEmbed((embed) => embed.setImage('https://media.discordapp.net/attachments/914004331525734410/914004395862151188/Bigturn.png'))
			.addPageEmbed((embed) => embed.setImage('https://media.discordapp.net/attachments/914004331525734410/914004396566790275/SmallTurn1.png'))
			.addPageEmbed((embed) => embed.setImage('https://media.discordapp.net/attachments/914004331525734410/914004396784885811/SmallTurn2.png'))
			.addPageEmbed((embed) => embed.setImage('https://media.discordapp.net/attachments/914004331525734410/914004397019758662/SmallTurn3.png'))
			.setSelectMenuOptions(async (ind) => ({
				label: [
					await resolveKey(interaction, 'common:welcome'),
					await resolveKey(interaction, 'common:profile'),
					await resolveKey(interaction, 'common:party'),
					await resolveKey(interaction, 'common:bigTurn'),
					`${await resolveKey(interaction, 'common:smallTurn')} 1`,
					`${await resolveKey(interaction, 'common:smallTurn')} 2`,
					`${await resolveKey(interaction, 'common:smallTurn')} 3`
				][ind - 1]
			}))
			.setSelectMenuPlaceholder(await resolveKey(interaction, 'common:selectMenuPlaceholder'));

		await message.run(interaction);
	}
}
