import { CommandInteraction, MessageEmbed } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { DurationFormatter } from '@sapphire/time-utilities';

@ApplyOptions<CommandOptions>({
	name: 'cooldown',
	preconditions: ['EphemeralDefer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder();

		this.container.functions.setNameAndDescriptions(builder, ['common:cooldown', 'validation:help.desccriptions.commands.COOLDOWN']);

		registry.registerChatInputCommand(builder, {
			idHints: ['987878508036509706'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);

		const { name } = (await this.container.db.collection('hunterinfo').findOne({ uid: interaction.user.id }))!;
		const { commands } = (await this.container.db.collection('cooldowns').findOne({ uid: interaction.user.id }))!;
		const dbl = await this.container.db.collection('dbl').findOne({ uid: interaction.user.id });

		const message = (name: string, cooldown: number) => {
			const on = (cooldown || Date.now()) - Date.now() <= 0;
			const emoji = on ? this.container.constants.EMOJIS.READY : this.container.constants.EMOJIS.COOLDOWNS;
			return resolveKey(interaction, 'validation:cooldown.command', {
				lng: locale,
				emoji,
				name: name.includes('vote') ? `\`$t(common:vote)\` ($t(common:${name.split(' ')[1]}))` : `\`$t(common:${name})\``,
				cooldown: on
					? '**$t(common:ready)**'
					: `**${new DurationFormatter(this.container.functions.timeUnitsLocalizations(locale)).format(cooldown - Date.now(), 4)}**`
			});
		};

		const embed = new MessageEmbed()
			.setColor('BLUE')
			.setAuthor({
				name: await resolveKey(interaction, 'validation:cooldown.author', { name, lng: locale }),
				iconURL: interaction.user.displayAvatarURL({ dynamic: true })
			})
			.setDescription(
				`${(await Promise.all(Object.entries(commands).map(([name, cooldown]) => message(name, cooldown)))).join('\n')}\n${await message(
					'vote bot',
					dbl?.bot || 0
				)}\n${await message('vote server', dbl?.server || 0)}`
			);

		await interaction.editReply({ embeds: [embed] });
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'cooldown'): UserCommand;
	}
}
