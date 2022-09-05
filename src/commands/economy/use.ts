import Fuse from 'fuse.js';

import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { editLocalized } from '@sapphire/plugin-i18next';

import {
	AutocompleteInteraction,
	BaseCommandInteraction,
	Collection,
	CommandInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction
} from 'discord.js';
import { Constants } from '../../utils/constants';
import type { HunterStats } from '../../lib/structures/schemas';

@ApplyOptions<CommandOptions>({
	name: 'use',
	preconditions: ['EphemeralDefer', 'IsHunter'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder().addStringOption(new SlashCommandStringOption().setRequired(true));

		this.container.functions.setNameAndDescriptions(
			builder,
			['common:use', 'validation:help.desccriptions.commands.USE'],
			[
				'common:item',
				'common:descriptions.useItem',
				[
					'glossary:items.Life Potion I.name',
					'glossary:items.Mana Potion I.name',
					'glossary:items.Thunder Stone.name',
					'glossary:items.Status Recovery.name'
				]
			]
		);

		registry.registerChatInputCommand(builder, {
			idHints: ['986829294120607744'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async autocompleteRun(interaction: AutocompleteInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		const value = interaction.options.getFocused();
		await interaction.respond(
			this.fuse(locale)
				.search({ $or: [{ label: `${value}` }, { name: `${value}` }] }, { limit: 25 })
				.map((result) => ({
					name: result.item.label,
					value: result.item.name
				}))
		);
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		const item = this.container.constants.ITEMS.find(
			(i) => i.name === interaction.options.getString(this.container.i18n.format('en-US', 'common:item').toLowerCase(), true)
		)!;

		if (!item) {
			await interaction.editReply(
				this.container.i18n.format(locale, 'common:missingField', {
					fields: this.container.i18n.format('en-US', 'common:item').toLowerCase()
				})
			);
		}

		switch (item.name.toLowerCase()) {
			default:
				await this.use(interaction, item.name.toLowerCase() as 'Life Potion I', locale);
		}
	}

	public async use(
		interaction: BaseCommandInteraction | MessageComponentInteraction,
		name: 'Life Potion I' | 'Mana Potion I' | 'Thunder Stone' | 'status recovery',
		locale: string
	) {
		const { hp, exp, mp } = (await this.container.db.collection('hunterstats').findOne({ uid: interaction.user.id }))!;
		const { classid } = (await this.container.db.collection('hunterinfo').findOne({ uid: interaction.user.id }))!;

		const level = this.container.functions.HunterLevelCalc(exp);
		const baseStats = this.container.constants.BaseStats[Constants.CLASSES[classid] as 'Assassin'];

		switch (name) {
			case 'Life Potion I': {
				const { potions } = (await this.container.db.collection('potions').findOne({ uid: interaction.user.id }))!;
				if (potions['Life Potion I'] <= 0) {
					await editLocalized(interaction, {
						keys: 'validation:use.runOut',
						formatOptions: { lng: locale, what: 'Life Potion I' }
					});
					return;
				}
				const hpMax = this.container.functions.MaxHPCalc(baseStats.hp, level);
				if (hp === hpMax) {
					await editLocalized(interaction, { keys: 'validation:use.maxHp', formatOptions: { lng: locale } });
					return;
				}

				await editLocalized(interaction, { keys: 'validation:use.life', formatOptions: { lng: locale } });
				await Promise.all([
					this.container.db.collection('potions').updateOne({ uid: interaction.user.id }, { $inc: { 'Life Potion I': -1 } }),
					this.container.db.collection('hunterstats').updateOne({ uid: interaction.user.id }, { $set: { hp: hpMax } })
				]);

				break;
			}
			case 'Mana Potion I': {
				const { potions } = (await this.container.db.collection('potions').findOne({ uid: interaction.user.id }))!;
				if (potions['Mana Potion I'] <= 0) {
					await editLocalized(interaction, {
						keys: 'validation:use.runOut',
						formatOptions: { lng: locale, what: 'Mana Potion I' }
					});
					return;
				}
				const mpMax = this.container.functions.OtherStatsCalc(baseStats.mp, level);
				if (mp === mpMax) {
					await editLocalized(interaction, { keys: 'validation:use.maxMp', formatOptions: { lng: locale } });
					return;
				}

				await editLocalized(interaction, { keys: 'validation:use.mana', formatOptions: { lng: locale } });
				await Promise.all([
					this.container.db.collection('potions').updateOne({ uid: interaction.user.id }, { $inc: { 'Mana Potion I': -1 } }),
					this.container.db.collection('hunterstats').updateOne({ uid: interaction.user.id }, { $set: { mp: mpMax } })
				]);

				break;
			}
			case 'Thunder Stone': {
				const { stones } = (await this.container.db.collection('stone').findOne({ uid: interaction.user.id }))!;
				if (stones['Thunder Stone'] <= 0) {
					await editLocalized(interaction, {
						keys: 'validation:use.runOut',
						formatOptions: { lng: locale, what: 'Thunder Stone' }
					});
					return;
				}

				const { equipped } = (await this.container.db.collection('equipment').findOne({ uid: interaction.user.id }))!;
				const { classid } = (await this.container.db.collection('hunterinfo').findOne({ uid: interaction.user.id }))!;
				const baseStats = this.container.constants.BaseStats[Constants.CLASSES[classid] as 'Assassin'] as unknown as Record<
					keyof HunterStats,
					number
				>;
				const level = this.container.functions.HunterLevelCalc(exp);

				const equipments = new Collection(Object.entries(equipped)).mapValues((code) =>
					this.container.constants.EQUIPMENTS.find((equipment) => equipment.eid === code)
				);

				baseStats.sp = level * 2;
				baseStats.hp = this.container.functions.MaxHPCalc(baseStats.hp, level);
				baseStats.str = this.container.functions.OtherStatsCalc(baseStats.str, level);
				baseStats.def = this.container.functions.OtherStatsCalc(baseStats.def, level);
				baseStats.int = this.container.functions.OtherStatsCalc(baseStats.int, level);
				baseStats.mr = this.container.functions.OtherStatsCalc(baseStats.mr, level);
				baseStats.agi = this.container.functions.OtherStatsCalc(baseStats.agi, level);
				baseStats.luk = this.container.functions.OtherStatsCalc(baseStats.luk, level);

				const equipmentStats = equipments
					.filter((equip) => Boolean(equip))
					.map((equip) => equip?.stats)
					.reduce<Constants.Equipments['stats']>((stats, equipmentStat) => {
						for (const statsName in equipmentStat!)
							if (Object.prototype.hasOwnProperty.call(equipmentStat, statsName))
								stats![statsName as 'agi'] =
									(stats![statsName as 'agi'] ?? 0) + (equipmentStat as Record<string, number>)[statsName]!;

						return stats;
					}, {});

				await editLocalized(interaction, { keys: 'validation:use.thunder', formatOptions: { lng: locale } });
				await Promise.all([
					this.container.db.collection('stone').updateOne({ uid: interaction.user.id }, { $inc: { 'Thunder Stone': -1 } }),
					this.container.db.collection('hunterstats').updateOne({ uid: interaction.user.id }, { $set: equipmentStats })
				]);
			}
			case 'status recovery': {
				const { has } = (await this.container.db.collection('recover').findOne({ uid: interaction.user.id }))!;
				if (!has) {
					await editLocalized(interaction, {
						keys: 'validation:use.runOut',
						formatOptions: { lng: locale, what: 'Status Recovery' }
					});
					return;
				}

				const components = [
					new MessageActionRow().setComponents([
						new MessageButton()
							.setCustomId(`Yes`)
							.setLabel(this.container.i18n.getT(locale)('common:yes'))
							.setStyle('SECONDARY')
							.setEmoji(this.container.constants.EMOJIS.UI.YES),
						new MessageButton()
							.setCustomId(`No`)
							.setLabel(this.container.i18n.getT(locale)('common:no'))
							.setStyle('PRIMARY')
							.setEmoji(this.container.constants.EMOJIS.UI.CANCEL)
					])
				];

				const msg = await editLocalized(interaction, {
					keys: 'validation:use.recovery.confirm',
					components,
					fetchReply: true,
					formatOptions: { lng: locale }
				});

				const collector = (msg as Message).createMessageComponentCollector({
					filter: (i) => i.user.id === interaction.user.id,
					time: 30000,
					max: 1
				});

				collector.on('collect', async (i) => {
					await i.deferUpdate();
					switch (i.customId) {
						case 'Yes':
							await editLocalized(interaction, {
								keys: 'validation:use.recovery.success',
								formatOptions: { lng: locale },
								components: []
							});
							await Promise.all([
								this.container.db.collection('recover').updateOne({ uid: interaction.user.id }, { $set: { has: false } }),
								this.container.db.collection('hunterstats').updateOne(
									{ uid: interaction.user.id },
									{
										$set: {
											hp: this.container.functions.MaxHPCalc(baseStats.hp, level),
											mp: this.container.functions.OtherStatsCalc(baseStats.mp, level)
										}
									}
								),
								this.container.db.collection('hunter').updateOne(
									{ uid: interaction.user.id },
									{
										$set: {
											'stats.hp': this.container.functions.MaxHPCalc(baseStats.hp, level),
											'stats.mp': this.container.functions.OtherStatsCalc(baseStats.mp, level),
											recovery: false
										}
									}
								)
							]);
							break;
						case 'No':
							await editLocalized(i, { keys: 'validation:use.recovery.decline', formatOptions: { lng: locale }, components: [] });
					}
				});

				collector.on('end', async (_collected, reason) => {
					if (reason === 'time')
						await editLocalized(interaction! || msg!, { keys: 'common:timeout', components: [], formatOptions: { lng: locale } });
				});
			}
		}
	}

	public fuse(locale: string) {
		return new Fuse(
			this.container.constants.ITEMS.filter((i) => i.category === 'Consumables').map((i) => ({
				label: this.container.i18n.format(locale, `glossary:items.${i.name}.name`),
				name: i.name,
				value: i
			})),
			{ keys: ['label', 'name'], threshold: 0.7, fieldNormWeight: 1 }
		);
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'use'): UserCommand;
	}
}
