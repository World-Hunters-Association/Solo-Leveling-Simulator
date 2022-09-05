import { ApplicationCommandOptionType } from 'discord-api-types/v9';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework';
import { editLocalized, resolveKey } from '@sapphire/plugin-i18next';
import { Subcommand, SubcommandMappingArray, SubcommandOptions } from '@sapphire/plugin-subcommands';

import type { Party } from '../../lib/structures/schemas';
import { isNullOrUndefined } from '@sapphire/utilities';
import Fuse from 'fuse.js';

@ApplyOptions<SubcommandOptions>({
	name: 'party',
	preconditions: ['Defer', 'IsHunter', 'IsMentionHunter'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Subcommand {
	public readonly subcommandMappings: SubcommandMappingArray = [
		{ name: 'create', chatInputRun: 'createRun' },
		{ name: 'disband', chatInputRun: 'disbandRun' },
		{ name: 'give', chatInputRun: 'giveRun' },
		{ name: 'info', chatInputRun: 'infoRun' },
		{ name: 'invite', chatInputRun: 'inviteRun' },
		{ name: 'kick', chatInputRun: 'kickRun' },
		{ name: 'leave', chatInputRun: 'leaveRun' },
		{ name: 'loots', chatInputRun: 'lootsRun' },
		{ name: 'transfer', chatInputRun: 'transferRun' }
	];

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder();

		this.container.functions.setNameAndDescriptions(builder, [
			'common:party',
			'validation:help.desccriptions.commands.PARTY',
			[
				[
					undefined,
					undefined,
					[
						[
							'common:create',
							'common:descriptions.partyCreate',
							[['common:name', 'common:descriptions.partyName', undefined, { type: ApplicationCommandOptionType['String'] }, 'String']]
						],
						['common:disband', 'common:descriptions.partyDisband'],
						[
							'common:give',
							'common:descriptions.partyGive',
							[
								[
									'common:hunter',
									'common:descriptions.partyMember',
									undefined,
									{ type: ApplicationCommandOptionType['User'], required: true },
									'User'
								],
								[
									'common:loots',
									'common:descriptions.partyLoots',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true, autocomplete: true },
									'String'
								],
								[
									'common:quantity',
									'common:descriptions.partyGiveQuantity',
									undefined,
									{ type: ApplicationCommandOptionType['Number'], autocomplete: true },
									'Number'
								]
							]
						],
						['common:info', 'common:descriptions.partyInfo'],
						[
							'common:invite',
							'common:descriptions.partyInvite',
							[
								[
									'common:hunter',
									'common:descriptions.partyMember',
									undefined,
									{ type: ApplicationCommandOptionType['User'], required: true },
									'User'
								]
							]
						],
						[
							'common:kick',
							'common:descriptions.partyKick',
							[
								[
									'common:hunter',
									'common:descriptions.partyMember',
									undefined,
									{ type: ApplicationCommandOptionType['User'], required: true },
									'User'
								]
							]
						],
						['common:leave', 'common:descriptions.partyLeave'],
						['common:loots', 'common:descriptions.partyLoots'],
						[
							'common:transfer',
							'common:descriptions.partyTransfer',
							[
								[
									'common:hunter',
									'common:descriptions.partyMember',
									undefined,
									{ type: ApplicationCommandOptionType['User'], required: true },
									'User'
								]
							]
						]
					]
				]
			]
		]);

		registry.registerChatInputCommand(builder, {
			idHints: ['992869302577397870'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async createRun(interaction: Command.ChatInputInteraction<'cached'>) {
		const { locale, party } = await this.init(interaction);

		if (Boolean(party)) {
			await editLocalized(interaction, { keys: 'validation:party.create.alreadyHave', formatOptions: { lng: locale } });
			return;
		}

		const { name } = (await this.container.db.collection('hunterinfo').findOne({ uid: interaction.user.id }))!;
		const pName =
			interaction.options.getString(this.container.i18n.format('en-US', 'common:name').toLowerCase()) ||
			(await resolveKey(interaction, 'validation:party.name', { lng: locale, name }))!;

		await this.container.db
			.collection('party')
			.insertOne({ uid: interaction.user.id, members: [{ uid: interaction.user.id, name }], loots: {}, name: pName });
		await this.infoRun(interaction);
	}

	public async disbandRun(interaction: Command.ChatInputInteraction<'cached'>) {
		const { locale, party } = await this.init(interaction);

		if (await this.notLeader(interaction, locale, party)) return;

		// TODO: Check if guild storage is full
		// TODO: Move party's loots to guild storage

		// ? Check loots
		if (Object.entries(party?.loots || {}).length > 0) {
			await editLocalized(interaction, { keys: 'validation:party.ungivenLoots', formatOptions: { lng: locale } });
			return;
		}

		// ? Check hunter left in gate
		if (Boolean(await this.container.db.collection('hunter').countDocuments({ plid: party?.uid }))) {
			await editLocalized(interaction, { keys: 'validation:party.memberInGate', formatOptions: { lng: locale } });
			return;
		}

		await this.container.db.collection('party').deleteOne({ uid: interaction.user.id });
		await editLocalized(interaction, { keys: 'validation:party.disband', formatOptions: { lng: locale } });
	}

	public async autocompleteRun(interaction: Command.AutocompleteInteraction<'cached'>) {
		const { locale, party } = await this.init(interaction);

		if (await this.noParty(interaction, locale, party)) return;

		const { name, value } = interaction.options.getFocused(true);
		switch (name) {
			case this.container.i18n.format('en-US', 'common:loots').toLowerCase():
				await interaction.respond(
					new Fuse(
						Object.keys(party!.loots).map((name) => ({
							label: this.container.i18n.format(locale, `glossary:materials.${name}.name`),
							name
						})),
						{ keys: ['label', 'name'], threshold: 0.7, fieldNormWeight: 1 }
					)
						.search({ $or: [{ label: `${value}` }, { name: `${value}` }] }, { limit: 25 })
						.map((result) => ({
							name: result.item.label,
							value: result.item.name
						}))
				);
				break;
			case this.container.i18n.format('en-US', 'common:quantity').toLowerCase(): {
				const item = interaction.options.getString(this.container.i18n.format('en-US', 'common:loots').toLowerCase());
				if (!item || isNullOrUndefined(party?.loots[item])) return;
				await interaction.respond([
					{
						name: Math.abs(Math.floor(Number(value) || 1)).toString(),
						value: Math.abs(Math.floor(Number(value) || 1))
					},
					{
						name: this.container.i18n.format(locale, 'validation:party.give.max', { count: party!.loots[item] }),
						value: party!.loots[item]
					}
				]);
			}
		}
	}

	public async giveRun(interaction: Command.ChatInputInteraction<'cached'>) {
		const { locale, party } = await this.init(interaction);

		if (await this.noParty(interaction, locale, party)) return;

		const user = interaction.options.getUser(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);
		const { name: uName } = (await this.container.db.collection('hunterinfo').findOne({ uid: user.id }))!;

		if (!party?.members.some((m) => m.uid === user.id)) {
			await editLocalized(interaction, {
				keys: 'validation:party.notInParty',
				formatOptions: { lng: locale, name: uName, partyName: party?.name }
			});
			return;
		}

		if (Boolean(await this.container.db.collection('hunter').countDocuments({ plid: party?.uid }))) {
			await editLocalized(interaction, { keys: 'validation:party.memberInGate', formatOptions: { lng: locale } });
			return;
		}

		const item = interaction.options.getString(this.container.i18n.format('en-US', 'common:loots').toLowerCase(), true);
		if (!item || isNullOrUndefined(party?.loots[item])) {
			await editLocalized(interaction, { keys: 'validation:party.give.invalidItem', formatOptions: { lng: locale } });
			return;
		}

		const quantity = Math.abs(
			Math.floor(interaction.options.getNumber(this.container.i18n.format('en-US', 'common:quantity').toLowerCase()) || 1)
		);

		if (quantity > party!.loots[item]) {
			await editLocalized(interaction, { keys: 'validation:party.give.notEnough', formatOptions: { lng: locale } });
			return;
		}

		await Promise.all([
			this.container.db
				.collection('party')
				.updateOne(
					{ uid: interaction.user.id },
					party!.loots[item] === quantity ? { $unset: { [`loots.${item}`]: '' } } : { $inc: { [`loots.${item}`]: -quantity } }
				),
			this.container.db.collection('material').updateOne({ uid: user.id }, { $inc: { [`materials.${item}`]: quantity } })
		]);

		await editLocalized(interaction, {
			keys: 'validation:party.give.success',
			formatOptions: { lng: locale, name: uName, item, quantity }
		});
	}

	public async infoRun(interaction: Command.ChatInputInteraction<'cached'>) {
		const { locale, party } = await this.init(interaction);

		if (await this.noParty(interaction, locale, party)) return;

		const embed = new MessageEmbed(
			await resolveKey(interaction, 'validation:party.info', {
				lng: locale,
				returnObjects: true,
				members: party?.members.map((m, ind) => (ind === 0 ? `**${m.name} \`[👑]\`**` : m.name)).join('\n'),
				loots:
					Object.entries(party?.loots || {})
						.filter((_, ind) => ind < 5)
						.map(([k, v]) => `$t(constant:emojis.materials.${k}) **$t(glossary:materials.${k}.name)**: ${v}`)
						.join('\n') || `*${await resolveKey(interaction, 'common:none', { lng: locale })}*`,
				name: party?.name,
				commandParty: this.container.functions.slashNameLocalizations('common:party')[locale as 'en-US'],
				subcommandLoots: this.container.functions.slashNameLocalizations('common:loots')[locale as 'en-US']
			})
		);
		await interaction.editReply({ embeds: [embed] });
	}

	public async inviteRun(interaction: Command.ChatInputInteraction<'cached'>) {
		let { locale, party } = await this.init(interaction);

		if (await this.notLeader(interaction, locale, party)) return;

		const user = interaction.options.getUser(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);
		const { name: uName } = (await this.container.db.collection('hunterinfo').findOne({ uid: user.id }))!;

		const p = await this.container.db.collection('party').findOne({ 'members.uid': user.id });
		if (Boolean(p)) {
			await editLocalized(interaction, {
				keys: 'validation:party.invite.alreadyHave',
				formatOptions: { lng: locale, name: uName }
			});
			return;
		}
		if (party?.members.length === 6) {
			await editLocalized(interaction, {
				keys: 'validation:party.invite.full',
				formatOptions: { lng: locale }
			});
			return;
		}

		locale = (await this.container.db.collection('language').findOne({ uid: user.id }))?.language || 'en-US';

		const message = await interaction.editReply({
			embeds: [
				await resolveKey(interaction, 'validation:party.invite.invitation', {
					lng: locale,
					name: uName,
					partyName: party?.name,
					returnObjects: true
				})
			],
			components: [
				new MessageActionRow().addComponents(
					new MessageButton()
						.setLabel(this.container.i18n.getT(locale)('common:yes'))
						.setEmoji(this.container.constants.EMOJIS.UI.YES)
						.setCustomId(`Party:Yes`)
						.setStyle('SECONDARY'),
					new MessageButton()
						.setLabel(this.container.i18n.getT(locale)('common:no'))
						.setEmoji(this.container.constants.EMOJIS.UI.CANCEL)
						.setCustomId(`Party:No`)
						.setStyle('DANGER')
				)
			]
		});

		const collector = message.createMessageComponentCollector({
			filter: (i) => i.user.id === user.id,
			componentType: 'BUTTON',
			time: 30000,
			max: 1
		});

		collector.on('collect', async (i) => {
			await i.deferUpdate();
			switch (i.customId) {
				case 'Party:Yes':
					await this.container.db
						.collection('party')
						.updateOne({ uid: interaction.user.id }, { $push: { members: { uid: user.id, name: uName } } });
					await interaction.editReply({
						embeds: [
							await resolveKey(interaction, 'validation:party.invite.accepted', {
								lng: locale,
								name: uName,
								partyName: party?.name,
								returnObjects: true
							})
						],
						components: []
					});
					break;
				case 'Party:No':
					await interaction.editReply({
						embeds: [
							await resolveKey(interaction, 'validation:party.invite.declined', {
								lng: locale,
								name: uName,
								partyName: party?.name,
								returnObjects: true
							})
						],
						components: []
					});
			}
		});

		collector.on('end', async (_i, reason) => {
			if (reason === 'time') {
				await interaction.editReply({
					embeds: [
						await resolveKey(interaction, 'validation:party.invite.timeout', { lng: locale, partyName: party?.name, returnObjects: true })
					],
					components: []
				});
			}
		});
	}

	public async kickRun(interaction: Command.ChatInputInteraction<'cached'>) {
		const { locale, party } = await this.init(interaction);

		if (await this.notLeader(interaction, locale, party)) return;

		const user = interaction.options.getUser(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);
		const { name: uName } = (await this.container.db.collection('hunterinfo').findOne({ uid: user.id }))!;

		if (party?.uid === user.id) {
			await this.disbandRun(interaction);
			return;
		}

		if (!party?.members.some((m) => m.uid === user.id)) {
			await editLocalized(interaction, {
				keys: 'validation:party.notInParty',
				formatOptions: { lng: locale, name: uName, partyName: party?.name }
			});
			return;
		}

		if (Boolean(await this.container.db.collection('hunter').countDocuments({ uid: user.id }))) {
			await editLocalized(interaction, {
				keys: 'validation:party.kick.inGate',
				formatOptions: { lng: locale, name: uName, partyName: party?.name }
			});
			return;
		}

		await this.container.db.collection('party').updateOne({ uid: interaction.user.id }, { $pull: { members: { uid: user.id } } });
		await interaction.editReply({
			embeds: [
				await resolveKey(interaction, 'validation:party.kick.success', {
					lng: locale,
					name: uName,
					partyName: party?.name,
					returnObjects: true
				})
			]
		});
	}

	public async leaveRun(interaction: Command.ChatInputInteraction<'cached'>) {
		const { locale, party } = await this.init(interaction);

		if (!this.noParty(interaction, locale, party)) return;

		if (party?.uid === interaction.user.id) {
			await this.disbandRun(interaction);
			return;
		}

		await this.container.db.collection('party').updateOne({ uid: interaction.user.id }, { $pull: { members: { uid: interaction.user.id } } });
		await interaction.editReply({
			embeds: [
				await resolveKey(interaction, 'validation:party.leave', {
					lng: locale,
					partyName: party?.name,
					returnObjects: true
				})
			]
		});
	}

	public async lootsRun(interaction: Command.ChatInputInteraction<'cached'>) {
		const { locale, party } = await this.init(interaction);

		if (!this.noParty(interaction, locale, party)) return;

		const loots = Object.entries(party!.loots)
			.sort((a, b) => {
				const amountCheck = b[1] - a[1];
				return amountCheck === 0 ? a[0].localeCompare(b[0]) : amountCheck;
			})
			.map(([k, v]) => this.container.i18n.format(locale, 'validation:party.loots.loot', { name: k, count: v }));

		const message = new PaginatedMessage({
			template: new MessageEmbed().setColor('BLUE').setAuthor({ name: party!.name })
		});

		const pageAmount = Math.ceil(loots.length / 10);
		for (let i = 0; i < pageAmount; i++) {
			message.addAsyncPageEmbed(async (embed) =>
				embed.setDescription(
					`**${await resolveKey(interaction, 'common:page', {
						lng: locale,
						context: 'format',
						page: i + 1,
						total: pageAmount
					})}**\n${loots
						.slice(i * 10, (i + 1) * 10)
						.map((l, ind) => `**${i * 10 + 1 + ind}.** ${l}`)
						.join('\n')}`
				)
			);
		}

		if (pageAmount === 0) message.addPageEmbed((embed) => embed.setDescription(this.container.i18n.format(locale, 'common:none')));

		message.setSelectMenuOptions((ind) => ({
			label: `${this.container.i18n.format(locale, 'common:page')} ${ind}`
		}));

		await message.run(interaction);
	}

	public async transferRun(interaction: Command.ChatInputInteraction<'cached'>) {
		const { locale, party } = await this.init(interaction);

		if (!this.notLeader(interaction, locale, party)) return;

		const user = interaction.options.getUser(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);
		const { name: uName } = (await this.container.db.collection('hunterinfo').findOne({ uid: user.id }))!;

		if (!party?.members.some((m) => m.uid === user.id)) {
			await editLocalized(interaction, {
				keys: 'validation:party.notInParty',
				formatOptions: { lng: locale, name: uName, partyName: party?.name }
			});
			return;
		}

		if (Boolean(await this.container.db.collection('gate_channel').countDocuments({ plid: interaction.user.id }))) {
			await editLocalized(interaction, {
				keys: 'validation:party.memberInGate',
				formatOptions: { lng: locale }
			});
			return;
		}

		// move the new leader to the first index of the members array
		party.members.unshift(
			party.members.splice(
				party.members.findIndex((m) => m.uid === user.id),
				1
			)[0]
		);

		await this.container.db.collection('party').updateOne({ uid: interaction.user.id }, { $set: { uid: user.id, members: party.members } });

		await interaction.editReply({
			embeds: [
				await resolveKey(interaction, 'validation:party.transfer', {
					lng: locale,
					name: uName,
					partyName: party?.name,
					returnObjects: true
				})
			]
		});
	}

	private async init(interaction: Command.ChatInputInteraction<'cached'> | Command.AutocompleteInteraction<'cached'>) {
		return {
			locale: await this.container.i18n.fetchLanguageWithDefault(interaction),
			party: await this.container.db.collection('party').findOne({ 'members.uid': interaction.user.id })
		};
	}

	private async noParty(
		interaction: Command.ChatInputInteraction<'cached'> | Command.AutocompleteInteraction<'cached'>,
		locale: string,
		party: Party | null
	) {
		if (!Boolean(party)) {
			if (!Reflect.has(interaction, 'respond'))
				await editLocalized(interaction as Command.ChatInputInteraction<'cached'>, {
					keys: 'validation:party.noParty',
					formatOptions: { lng: locale }
				});
			return true;
		}
		return false;
	}

	private async notLeader(
		interaction: Command.ChatInputInteraction<'cached'> | Command.AutocompleteInteraction<'cached'>,
		locale: string,
		party: Party | null
	) {
		if (await this.noParty(interaction, locale, party)) return true;
		if (party?.uid !== interaction.user.id) {
			if (!Reflect.has(interaction, 'respond'))
				await editLocalized(interaction as Command.ChatInputInteraction<'cached'>, {
					keys: 'validation:party.notLeader',
					formatOptions: { lng: locale }
				});
			return true;
		}
		return false;
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'party'): UserCommand;
	}
}
