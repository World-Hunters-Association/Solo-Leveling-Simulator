import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';

import { CommandInteraction, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'info',
	preconditions: ['Defer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder();

		this.container.functions.setNameAndDescriptions(builder, ['common:info', 'validation:help.desccriptions.commands.INFO']);

		registry.registerChatInputCommand(builder, {
			idHints: ['987878510339178506'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);

		const embed = new MessageEmbed().setColor('BLUE').addFields([
			{
				name: await resolveKey(interaction, 'common:server', { lng: locale }),
				value:
					((await this.container.client.shard?.fetchClientValues(`guilds.cache.size`)) as number[])
						?.reduce((t, v) => t + v, 0)
						.toString() || this.container.client.guilds.cache.size.toString(),
				inline: true
			},
			{
				name: await resolveKey(interaction, 'common:hunter', { lng: locale }),
				value: (await this.container.db.collection('hunterinfo').countDocuments())?.toString(),
				inline: true
			},
			{
				name: await resolveKey(interaction, 'common:uptime', { lng: locale }),
				value: `<t:${Math.round((Date.now() - this.container.client.uptime!) / 1000)}:R>`,
				inline: true
			},
			{
				name: await resolveKey(interaction, 'common:shard', { lng: locale }),
				value: `${interaction.guild!.shardId + 1}/${this.container.client.shard?.count ?? 1}`,
				inline: true
			},
			{
				name: await resolveKey(interaction, 'common:library', { lng: locale }),
				value: '[discord.js](https://discord.js.org/#/) | [Sapphire](https://www.sapphirejs.dev/)',
				inline: true
			},
			{
				name: await resolveKey(interaction, 'common:links', { lng: locale }),
				value: await resolveKey(interaction, 'validation:links', { lng: locale, uid: interaction.user.id })
			}
		]);

		await interaction.editReply({ embeds: [embed] });
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'info'): UserCommand;
	}
}
