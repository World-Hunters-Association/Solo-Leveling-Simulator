import { CommandInteraction, MessageEmbed } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';

import { EMOJIS } from '../../lib/constants';

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
		const locale = (await this.container.i18n.fetchLanguage(interaction)) || 'en-US';
		const message = new PaginatedMessage({
			template: new MessageEmbed().setColor('BLUE')
		})
			.setActions(
				[
					{
						customId: 'Start:Rule',
						label: this.container.i18n.getT(locale)('common:rule'),
						style: 'DANGER',
						emoji: EMOJIS.UI.RULE,
						type: 'BUTTON',
						run: () => {
							this.container.applicationCommandRegistries.acquire('rule').command?.chatInputRun!(interaction, {
								commandName: 'rule',
								commandId: '970712020779401277'
							});
						}
					},
					{
						customId: 'Start:Help',
						label: this.container.i18n.getT(locale)('common:help'),
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
						label: this.container.i18n.getT(locale)('common:chooseClass'),
						style: 'SECONDARY',
						emoji: EMOJIS.UI.CHOOSE_CLASS,
						type: 'BUTTON',
						run: () => {
							this.container.applicationCommandRegistries.acquire('chooseclass').command?.chatInputRun!(interaction, {
								commandName: 'chooseclass',
								commandId: '971018017678958602'
							});
						}
					},
					{
						url: 'https://linktr.ee/mzato0001',
						label: this.container.i18n.getT(locale)('common:links'),
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
			.setSelectMenuOptions((ind) => ({
				label: [
					this.container.i18n.getT(locale)('common:welcome'),
					this.container.i18n.getT(locale)('common:profile'),
					this.container.i18n.getT(locale)('common:party'),
					this.container.i18n.getT(locale)('common:bigTurn'),
					`${this.container.i18n.getT(locale)('common:smallTurn')} 1`,
					`${this.container.i18n.getT(locale)('common:smallTurn')} 2`,
					`${this.container.i18n.getT(locale)('common:smallTurn')} 3`
				][ind - 1]
			}))
			.setSelectMenuPlaceholder(this.container.i18n.getT(locale)('common:selectMenuPlaceholder'));

		await message.run(interaction);
	}
}
