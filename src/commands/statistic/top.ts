import { MessageEmbed } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, RegisterBehavior } from '@sapphire/framework';
import { editLocalized, resolveKey } from '@sapphire/plugin-i18next';
import { Subcommand, SubcommandMappingArray, SubcommandOptions } from '@sapphire/plugin-subcommands';

@ApplyOptions<SubcommandOptions>({
	name: 'top',
	preconditions: ['Defer', 'IsHunter', 'GuildOnly'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Subcommand {
	public readonly subcommandMappings: SubcommandMappingArray = [
		{
			name: 'server',
			type: 'group',
			entries: [
				{ name: 'level', chatInputRun: 'serverLevelRun' },
				{ name: 'rank', chatInputRun: 'serverRankRun' },
				{ name: 'gold', chatInputRun: 'serverGoldRun' }
			]
		},
		{
			name: 'global',
			type: 'group',
			entries: [
				{ name: 'level', chatInputRun: 'globalLevelRun' },
				{ name: 'rank', chatInputRun: 'globalRankRun' },
				{ name: 'gold', chatInputRun: 'globalGoldRun' }
			]
		}
	];

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder();

		this.container.functions.setNameAndDescriptions(builder, [
			'common:top',
			'validation:help.desccriptions.commands.TOP',
			[
				[
					'common:server',
					'common:descriptions.topServer',
					[
						['common:level', 'common:descriptions.topServerLevel'],
						['common:rank', 'common:descriptions.topServerRank'],
						['glossary:currencies.gold', 'common:descriptions.topServerGold']
					]
				],
				[
					'common:global',
					'common:descriptions.topGlobal',
					[
						['common:level', 'common:descriptions.topGlobalLevel'],
						['common:rank', 'common:descriptions.topGlobalRank'],
						['glossary:currencies.gold', 'common:descriptions.topGlobalGold']
					]
				]
			]
		]);

		registry.registerChatInputCommand(builder, {
			idHints: ['995208027818962965'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async serverLevelRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		await this.run(interaction, 'server', 'level');
	}

	public async serverRankRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		await this.run(interaction, 'server', 'rank');
	}

	public async serverGoldRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		await this.run(interaction, 'server', 'gold');
	}

	public async globalLevelRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		await this.run(interaction, 'global', 'level');
	}

	public async globalRankRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		await this.run(interaction, 'global', 'rank');
	}

	public async globalGoldRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		await this.run(interaction, 'global', 'gold');
	}

	public async run(interaction: Subcommand.ChatInputInteraction<'cached'>, type: 'global' | 'server', statistic: 'level' | 'rank' | 'gold') {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);

		const data = await this.container.db
			.collection('top')
			.findOne({ gid: type === 'global' ? this.container.client.user?.id : interaction.guildId });

		if (!data || !data.top[statistic]) {
			await editLocalized(interaction, { keys: 'validation:top.notFound', formatOptions: { lng: locale } });
			return;
		}

		const names = await this.container.db
			.collection('hunterinfo')
			.find({ uid: { $in: data.top[statistic].map((user) => user.uid) } })
			.toArray();

		const top = data.top[statistic].map((d, i) =>
			this.container.i18n.format(locale, `validation:top.format_${statistic}`, {
				...d,
				name: names.find((n) => n.uid === d.uid)?.name,
				index: i + 1
			})
		);

		if (type === 'global')
			await interaction.editReply({
				embeds: [
					await resolveKey(interaction, 'validation:top.global', {
						lng: locale,
						returnObjects: true,
						data: top.join('\n'),
						date: Math.floor(data.date.getTime() / 1000)
					})
				]
			});
		else {
			const message = new PaginatedMessage({
				template: new MessageEmbed().setColor('BLUE').setTitle(await resolveKey(interaction, 'validation:top.server.title', { lng: locale }))
			});
			const pageAmount = Math.ceil(top.length / 15);
			for (let i = 0; i < pageAmount; i++) {
				message.addAsyncPageEmbed(async (embed) =>
					embed.setDescription(
						`**${await resolveKey(interaction, 'common:page', {
							lng: locale,
							context: 'format',
							page: i + 1,
							total: pageAmount
						})}**\n${top.slice(i * 15, (i + 1) * 15).join('\n')}\n\n*${await resolveKey(interaction, 'validation:top.server.footer', {
							lng: locale,
							date: Math.floor(data.date.getTime() / 1000)
						})}*`
					)
				);
			}

			await message.run(interaction);
		}
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'top'): UserCommand;
	}
}
