import { Collection, CommandInteraction, MessageEmbed } from 'discord.js';

import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandUserOption } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';

import { CLASSES, Equipments, RANK, RANK_TITLES } from '../../utils/constants';

@ApplyOptions<CommandOptions>({
	name: 'profile',
	description: 'Show hunter profile',
	preconditions: ['IsHunter', 'IsMentionHunter'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder().addUserOption(new SlashCommandUserOption()).addBooleanOption(new SlashCommandBooleanOption());

		this.container.functions.setNameAndDescriptions(
			builder,
			['common:profile', 'validation:help.desccriptions.commands.PROFILE'],
			['common:hunter', 'common:descriptions.hunterProfile'],
			['common:show', 'common:descriptions.showProfile']
		);

		registry.registerChatInputCommand(builder, {
			idHints: ['980673134665539634'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: !interaction.options.getBoolean('show') ?? true });

		// TODO: WHA Staffs can see all profiles
		// TODO: Require profile skill to see others profiles
		// TODO: Cannot see others profiles if they have a higher level than you

		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);

		const target = interaction.options.getUser('hunter');
		const tid = target?.id || interaction.user.id;
		const { titleid, name, classid, rankid } = (await this.container.db.collection('hunterinfo').findOne({ uid: tid }))!;
		const { exp, hp, mp, int, str, mr, def, sp, vit, agi } = (await this.container.db.collection('hunterstats').findOne({ uid: tid }))!;
		const { challenges } = (await this.container.db.collection('challenges').findOne({ uid: tid }))!;
		const { magicCore, manaCrystal, gold } = (await this.container.db.collection('money').findOne({ uid: tid }))!;
		const { equipped } = (await this.container.db.collection('equipment').findOne({ uid: tid }))!;

		const level = this.container.functions.HunterLevelCalc(exp);

		const equipments = new Collection(Object.entries(equipped)).mapValues(
			(code) => this.container.constants.EQUIPMENTS.find((equipment) => equipment.uniqueCode === code)!
		);
		const {
			str: eqStr,
			int: eqInt,
			def: eqDef,
			mr: eqMr,
			vit: eqVit,
			agi: eqAgi
		} = equipments
			.filter((equip) => Boolean(equip))
			.map((equip) => equip?.stats)
			.reduce<Equipments['stats']>((stats, equipmentStat) => {
				for (const statsName in equipmentStat!)
					if (Object.prototype.hasOwnProperty.call(equipmentStat, statsName))
						stats![statsName as 'hp'] = (stats![statsName as 'hp'] ?? 0) + (equipmentStat as Equipments['stats'])![statsName as 'hp']!;
				return stats;
			}, {});

		const embed = new MessageEmbed()
			.setColor('BLUE')
			.setAuthor({
				name: await resolveKey(interaction, 'validation:profile.author', { name, lng: locale }),
				iconURL: (target ? target : interaction.user).displayAvatarURL({ dynamic: true })
			})
			.setTitle(RANK_TITLES[titleid as 1])
			.setThumbnail((target ? target : interaction.user).displayAvatarURL({ dynamic: true }))
			.addFields(
				{
					name: await resolveKey(interaction, 'common:information', { lng: locale }),
					value: (
						await resolveKey(interaction, 'validation:profile.information.left', {
							class: CLASSES[classid].toLowerCase(),
							rank: RANK[rankid].toLowerCase().split(/-| /)[0],
							lng: locale
						})
					).replace(/\*\*(\w)(\w*)\*\*/g, (_, $1, $2) => `**${$1.toUpperCase()}${$2}**`),
					inline: true
				},
				{
					name: '** **',
					value: await resolveKey(interaction, 'validation:profile.information.right', {
						level,
						exp,
						maxExp: this.container.functions.MaxLevelExpCalc(level),
						guild: await resolveKey(interaction, 'common:none', { lng: locale }),
						lng: locale
					}),
					inline: true
				},
				{
					name: await resolveKey(interaction, 'common:challenges', { lng: locale }),
					value: await resolveKey(interaction, 'glossary:challenges.hunterSlayer', {
						context: 'count',
						count: challenges['Kill:Hunter'] || 0,
						lng: locale
					})
				},
				{
					name: await resolveKey(interaction, 'common:baseStats', { lng: locale }),
					value: await resolveKey(interaction, 'validation:profile.stats.left', {
						hp,
						maxHp: this.container.functions.MaxHPCalc(vit, level),
						str,
						eqStr: eqStr || 0,
						def,
						eqDef: eqDef || 0,
						vit,
						eqVit: eqVit || 0,
						lng: locale
					}),
					inline: true
				},
				{
					name: '** **',
					value: await resolveKey(interaction, 'validation:profile.stats.right', {
						mp,
						maxMp: this.container.functions.MaxMPCalc(int, level),
						int,
						eqInt: eqInt || 0,
						mr,
						eqMr: eqMr || 0,
						agi,
						eqAgi: eqAgi || 0,
						lng: locale
					}),
					inline: true
				},
				{
					name: '** **',
					value: await resolveKey(interaction, 'validation:profile.statsPoint', { count: sp, lng: locale })
				},
				{
					name: await resolveKey(interaction, 'common:money', { lng: locale }),
					value: await resolveKey(interaction, 'validation:profile.money.money', {
						manaCrystal,
						gold,
						magicCore,
						lng: locale
					})
				}
			);

		await interaction.editReply({ embeds: [embed] });
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'profile'): UserCommand;
	}
}
