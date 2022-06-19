import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';

import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'invite',
	preconditions: ['Defer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder();

		this.container.functions.setNameAndDescriptions(builder, ['common:invite', 'validation:help.desccriptions.commands.INVITE']);

		registry.registerChatInputCommand(builder, {
			idHints: ['987878511626829844'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);

		const embed = new MessageEmbed()
			.setColor('BLUE')
			.setDescription(await resolveKey(interaction, 'validation:invite.description', { lng: locale }));

		await interaction.editReply({
			embeds: [embed],
			components: [
				new MessageActionRow().addComponents([
					new MessageButton()
						.setStyle('LINK')
						.setURL(this.container.i18n.format(locale, 'constant:botInvite'))
						.setLabel(await resolveKey(interaction, 'validation:invite.bot')),
					new MessageButton()
						.setStyle('LINK')
						.setURL(this.container.i18n.format(locale, 'constant:serverInvite'))
						.setLabel(await resolveKey(interaction, 'validation:invite.server', { lng: locale }))
				])
			]
		});
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'invite'): UserCommand;
	}
}
