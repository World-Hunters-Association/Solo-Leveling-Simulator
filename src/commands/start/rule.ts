import { CommandInteraction, MessageEmbed } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';

@ApplyOptions<CommandOptions>({
	name: 'rule',
	description: 'Show bot rule',
	preconditions: ['Defer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class RuleCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(new SlashCommandBuilder().setName(this.name).setDescription(this.description), {
			idHints: ['970712020779401277'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const embed = new MessageEmbed()
			.setTitle(`📜 ${(await resolveKey(interaction, 'common:rule')).toUpperCase()} 📜`)
			.setColor('BLUE')
			.setDescription(`${await resolveKey(interaction, 'validation:rule.rule', { invite: 'https://discord.gg/x8MgGnaNK5' })}`);

		await interaction.editReply({ embeds: [embed] });
	}
}
