import {
	AutocompleteInteraction,
	Collection,
	CommandInteraction,
	Interaction,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageSelectMenu,
	SelectMenuInteraction
} from 'discord.js';
import Fuse from 'fuse.js';

import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';

import { CLASSES, CLASSES_INFO, COMMANDS, EMOJIS, RANK, STATS } from '../../lib/constants';
import { Equipments, EQUIPMENTS } from '../../lib/structures/equipments';
import { Items, ITEMS } from '../../lib/structures/items';
import { Mobs, MOBS } from '../../lib/structures/mobs';
import { HUNTER_SKILLS, MOB_SKILLS } from '../../lib/structures/skills';

import type { HunterSkills, MobSkills } from '../../lib/structures/skills';
import { DROPS } from '../../lib/structures/drops';

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'Displays a list of available commands, or detailed information for a specified command/item.',
	preconditions: ['Defer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class HelpCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(
			new SlashCommandBuilder()
				.setName(this.name)
				.setDescription(this.description)
				.addStringOption(
					new SlashCommandStringOption()
						.setAutocomplete(true)
						.setName(this.container.i18n.format('en-US', 'common:term').toLowerCase())
						.setNameLocalizations({
							'en-US': this.container.i18n.format('en-US', 'common:term').toLowerCase(),
							vi: this.container.i18n.format('vi', 'common:term').toLowerCase().replace(/\s*/g, '-')
						})
						.setDescription(this.container.i18n.format('en-US', 'common:descriptions.term'))
						.setDescriptionLocalizations({
							'en-US': this.container.i18n.format('en-US', 'common:descriptions.term'),
							vi: this.container.i18n.format('vi', 'common:descriptions.term')
						})
				),
			{
				idHints: ['924315533854277632'],
				behaviorWhenNotIdentical: RegisterBehavior.Overwrite
			}
		);
	}

	public async autocompleteRun(interaction: AutocompleteInteraction) {
		const fuse = await this.fuse(interaction);

		const p = `${interaction.options.getFocused()}`;

		await interaction.respond(
			fuse
				.search({ $or: [{ label: p }, { name: p }, { aliases: p }] })
				.filter((_result, ind) => ind < 25)
				.map((result) => ({ name: result.item.label, value: result.item.name, emoji: result.item.emoji }))
		);
	}

	public async chatInputRun(interaction: CommandInteraction | SelectMenuInteraction) {
		const locale = (await this.container.i18n.fetchLanguage(interaction)) || 'en-US';
		const fuse = await this.fuse(interaction);
		const type = fuse.search({
			$or: [
				{
					label: (interaction as CommandInteraction).options?.getString('terms') || (interaction as SelectMenuInteraction).values?.[0] || ''
				},
				{ name: (interaction as CommandInteraction).options?.getString('terms') || (interaction as SelectMenuInteraction).values?.[0] || '' },
				{
					aliases:
						(interaction as CommandInteraction).options?.getString('terms') || (interaction as SelectMenuInteraction).values?.[0] || ''
				}
			]
		});
		let embed = new MessageEmbed({ footer: { text: await resolveKey(interaction, 'validation:help.footer', { lng: locale }) } }).setColor('BLUE');
		let components: MessageActionRow[] = [];
		if (type?.length > 1)
			components.unshift(
				new MessageActionRow().addComponents([
					new MessageSelectMenu()
						.addOptions(
							type
								?.filter((_t, ind) => ind <= 25 && ind >= 1)
								.map((t) => t.item)
								.map((t) => ({ label: t.label.toUpperCase(), value: t.name, emoji: t.emoji ?? EMOJIS.UI.GUIDE }))
						)
						.setCustomId(`Help:COMMANDS:${interaction.user.id}`)
						.setPlaceholder(await resolveKey(interaction, 'common:selectMenuPlaceholder', { lng: locale }))
				])
			);

		switch (type?.[0]?.item.type) {
			case 'COMMANDS': {
				const info = type[0].item.value as { ALIASES: string; USAGE: string; EXAMPLES: string };
				embed
					.setTitle(type[0].item.label.toUpperCase())
					.setDescription(await resolveKey(interaction, `validation:help.descriptions.commands.${type[0].item.name.toUpperCase()}`))
					.addFields([
						{ name: `${await resolveKey(interaction, 'common:aliases', { lng: locale })}:`, value: info.ALIASES },
						{ name: `${await resolveKey(interaction, 'common:usage', { lng: locale })}:`, value: info.USAGE },
						{ name: `${await resolveKey(interaction, 'common:examples', { lng: locale })}:`, value: info.EXAMPLES }
					]);
				break;
			}
			case 'CLASSES': {
				const info = type[0].item.value as { EMOJI: string; BASE_STATS: { [key: string]: number } };
				const [big, small] = new Collection(Object.entries(info.BASE_STATS)).partition(
					(_value, key, coll) => coll.map((_v, k) => k).indexOf(key) <= Math.ceil(coll.size / 2) - 1
				);
				const skills = HUNTER_SKILLS.filter(
					(skill) => skill.class === CLASSES[type[0].item.name.toLowerCase().replace(/^\w/, (l) => l.toUpperCase()) as 'Assassin']
				);

				embed
					.setTitle(type[0].item.label.toUpperCase())
					.setDescription(
						await resolveKey(interaction, `validation:chooseClass.descriptions.${type[0].item.name.toLowerCase()}`, { lng: locale })
					)
					.addFields([
						{
							name: await resolveKey(interaction, 'common:baseStats', { lng: locale }),
							value: big
								.map(
									(value, key) =>
										`${
											EMOJIS.STATS[STATS[key as 'agi']?.toUpperCase().replace(/ /g, '_') as 'AGILITY']
										} **${this.container.i18n.format(locale, `glossary:stats.${key}`)}**: ${value}`
								)
								.join('\n'),
							inline: true
						},
						{
							name: '** **',
							value: small
								.map(
									(value, key) =>
										`${
											EMOJIS.STATS[STATS[key as 'agi']?.toUpperCase().replace(/ /g, '_') as 'AGILITY']
										} **${this.container.i18n.format(locale, `glossary:stats.${key}`)}**: ${value}`
								)
								.join('\n'),
							inline: true
						},
						{ name: '** **', value: '** **', inline: true },
						{
							name: await resolveKey(interaction, 'common:skills'),
							value: skills
								.filter((_skill, ind) => ind <= Math.ceil(skills.length / 2) - 1)
								.map((skill) => `${skill.emoji} **${this.container.i18n.format(locale, `glossary:skills.${skill.name}.name`)}**`)
								.join('\n'),
							inline: true
						},
						{
							name: '** **',
							value: skills
								.filter((_skill, ind) => ind > Math.ceil(skills.length / 2) - 1)
								.map((skill) => `${skill.emoji} **${this.container.i18n.format(locale, `glossary:skills.${skill.name}.name`)}**`)
								.join('\n'),
							inline: true
						},
						{ name: '** **', value: '** **', inline: true }
					])
					.setThumbnail(`https://cdn.discordapp.com/emojis/${info.EMOJI.split(':')[2].replace('>', '')!}.png`);
				break;
			}
			case 'TERMS': {
				const info = type[0].item.value as typeof COMMANDS.HELP.TERMS[keyof typeof COMMANDS.HELP.TERMS];
				embed.setTitle(type[0].item.label.toUpperCase());
				if ((info as any).EMOJI)
					embed.setThumbnail(`https://cdn.discordapp.com/emojis/${(info as any).EMOJI.split(':')[2].replace('>', '')!}.png`);
				embed = Object.assign(embed, info.EMBED);
				embed.setDescription(await resolveKey(interaction, `glossary:terms.${type[0].item.name}.description`, { lng: locale }));
				break;
			}
			case 'HUNTER_SKILLS': {
				const info = type[0].item.value as HunterSkills;
				const [big, small] = new Collection(Object.entries(info.levelDepends)).partition(
					(_value, key, coll) => coll.map((_v, k) => k).indexOf(key) <= Math.ceil(coll.size / 2) - 1
				);
				embed
					.setTitle(type[0].item.label.toUpperCase())
					.setDescription(info.description!)
					.addFields(
						[
							{
								name: `${await resolveKey(interaction, 'common:class', { lng: locale })}:`,
								value: `${EMOJIS.CLASSES[info.class]} ${CLASSES[info.class]}`,
								inline: true
							},
							{
								name: `${await resolveKey(interaction, 'common:rank', { lng: locale })}:`,
								value: `${EMOJIS.RANKS[info.rank]} ${RANK[info.rank]}`,
								inline: true
							},
							{ name: '** **', value: '** **', inline: true }
						].concat({
							name: '** **',
							value: big
								.map(
									(value, key) =>
										`**${this.container.i18n.format(locale, `common:levelDepends.${key}`)}**: ${value.replace(/\:/g, '/')}`
								)
								.join('\n'),
							inline: true
						})
					);
				embed.addField(
					'** **',
					small.size
						? small
								.map(
									(value, key) =>
										`**${this.container.i18n.format(locale, `common:levelDepends.${key}`)}**: ${value.replace(/\:/g, '/')}`
								)
								.join('\n')
						: '** **',
					true
				);
				embed.addField('** **', `** **`, true);
				embed.setThumbnail(`https://cdn.discordapp.com/emojis/${info.emoji?.split(':')[2].replace('>', '')}.png`);
				break;
			}
			case 'MOB_SKILLS': {
				const { amount, size, turns, species, name, emoji } = type[0].item.value as MobSkills;
				const [big, small] = new Collection<string, `${number}:${number}`>(Object.entries({ amount, size, turns } as any))
					.filter((v) => Boolean(v))
					.partition((_value, key, coll) => coll.map((_v, k) => k).indexOf(key) <= Math.ceil(coll.size / 2) - 1);
				embed
					.setTitle(type[0].item.label.toUpperCase())
					.setDescription(await resolveKey(interaction, `glossary:skills.${name}.description`, { lng: locale }));
				if (!['Normal', 'Boss'].includes(species))
					embed.addField(
						`**${await resolveKey(interaction, 'common:species', { lng: locale })}**: ${
							MOBS.find((mob) => mob.species === species && mob.isBoss)?.emoji
						} ${species}`,
						big.size
							? big
									.map(
										(value, key) =>
											`**${this.container.i18n.format(locale, `common:levelDepends.${key}`)}**: ${value.replace(/\:/g, '/')}`
									)
									.join('\n')
							: '** **',
						true
					);
				embed.addField(
					'** **',
					small.size
						? small
								.map(
									(value, key) =>
										`**${this.container.i18n.format(locale, `common:levelDepends.${key}`)}**: ${value.replace(/\:/g, '/')}`
								)
								.join('\n')
						: '** **',
					true
				);
				embed.addField('** **', `** **`, true);
				embed.setThumbnail(`https://cdn.discordapp.com/emojis/${emoji?.split(':')[2].replace('>', '')}.png`);
				break;
			}
			case 'ITEMS': {
				const info = type[0].item.value as Items;
				embed.setTitle(type[0].item.label.toUpperCase());
				if (isFinite(info.price))
					embed.addField(
						`${await resolveKey(interaction, 'common:sellValue', { lng: locale })}`,
						`**${Intl.NumberFormat().format(Math.floor(info.price * 0.7))} ${await resolveKey(interaction, 'glossary:currencies.gold', {
							count: info.price * 0.7,
							lng: locale
						})}**`
					);
				if (info.description)
					embed.setDescription(await resolveKey(interaction, `glossary:items.${type[0].item.name}.description`, { lng: locale }));
				embed.setThumbnail(`https://cdn.discordapp.com/emojis/${info.emoji?.split(':')[2].replace('>', '')}.png`);
				break;
			}
			case 'EQUIPMENTS': {
				const info = type[0].item.value as Equipments;
				const [big, small] = new Collection(Object.entries(info.stats)).partition(
					(_value, key, coll) => coll.map((_v, k) => k).indexOf(key) <= Math.ceil(coll.size / 2) - 1
				);
				embed
					.setTitle(type[0].item.label.toUpperCase())
					.setDescription(
						`${await resolveKey(interaction, `glossary:equipments.${type[0].item.name}.description`, {
							lng: locale
						})}\n\n**${await resolveKey(interaction, 'common:type', { lng: locale })}**: ${info.type.replace(/^\w/, (l) =>
							l.toUpperCase()
						)}\n**${await resolveKey(interaction, 'common:sellValue', { lng: locale })}**: ${
							info.sellPrice ? Intl.NumberFormat().format(info.sellPrice) : '??'
						} Golds`
					)
					.addField(
						`**${await resolveKey(interaction, 'common:baseStats', { lng: locale })}**:`,
						big.map((value, key) => `**${this.container.i18n.format(locale, `glossary:stats.${key}`)}**: ${value}`).join('\n'),
						true
					)
					.addField(
						'** **',
						small.size
							? small.map((value, key) => `**${this.container.i18n.format(locale, `glossary:stats.${key}`)}**: ${value}`).join('\n')
							: '** **',
						true
					)
					.addField('** **', `** **`, true)
					.setThumbnail(`https://cdn.discordapp.com/emojis/${info.emoji?.split(':')[2].replace('>', '')}.png`);
				break;
			}
			case 'MOBS': {
				const mob = type[0].item.value as Mobs;
				const [big, small] = new Collection(Object.entries(mob.stats)).partition(
					(_value, key, coll) => coll.map((_v, k) => k).indexOf(key) <= Math.ceil(coll.size / 2) - 1
				);
				const skill = MOB_SKILLS.find((skill) => skill.species === mob.species || skill.species === (mob.isBoss ? 'Boss' : 'Normal'));
				embed
					.setTitle(`**${mob.name.toUpperCase()}**`)
					.setDescription(
						`**${await resolveKey(interaction, 'common:rank', { lng: locale })}**: ${EMOJIS.RANKS[mob.rank]} ${
							RANK[mob.rank]
						}\n**${await resolveKey(interaction, 'common:skills', { lng: locale })}**: ${skill?.emoji} ${
							skill?.name
						}\n**${await resolveKey(interaction, 'common:drop', { lng: locale })}**: ${DROPS.filter(
							(drop) => drop.species === mob.species
						)
							.map((drop) => `${drop.emoji} ${drop.name}`)
							.join(', ')}`
					)
					.addField(
						`**${await resolveKey(interaction, 'common:baseStats', { lng: locale })}**:`,
						big
							.map(
								(value, key) =>
									`**${this.container.i18n.format(
										locale,
										`${key === 'range' ? `common:levelDepends.range` : `glossary:stats.${key}`}`
									)}**: ${value}`
							)
							.join('\n'),
						true
					)
					.addField(
						'** **',
						small.size
							? small
									.map(
										(value, key) =>
											`**${this.container.i18n.format(
												locale,
												`${key === 'range' ? `common:levelDepends.range` : `glossary:stats.${key}`}`
											)}**: ${value}`
									)
									.join('\n')
							: '** **',
						true
					)
					.addField('** **', `** **`, true)
					.setThumbnail(`https://cdn.discordapp.com/emojis/${mob.emoji?.split(':')[2].replace('>', '')}.png`);
				break;
			}
			default: {
				embed.setTitle(`${EMOJIS.LOGO.SMALL} **COMMANDS** ${EMOJIS.LOGO.SMALL}`).addFields(
					{
						name: await resolveKey(interaction, 'validation:help.defaultEmbed.moreInfo', { lng: locale }),
						value: await resolveKey(interaction, 'validation:help.defaultEmbed.tutorial', { lng: locale })
					},
					{ name: '** **', value: await resolveKey(interaction, 'validation:help.defaultEmbed.commands', { lng: locale }) },
					{
						name: await resolveKey(interaction, 'common:links', { lng: locale }),
						value: await resolveKey(interaction, 'validation:links', { lng: locale, uid: interaction.user.id })
					}
				);
				embed.footer = { text: await resolveKey(interaction, 'validation:help.defaultEmbed.footer', { lng: locale }) };
				components = [
					new MessageActionRow().addComponents(
						new MessageSelectMenu()
							.addOptions([
								{
									label: 'Statistics',
									value: 'STATISTICS',
									emoji: '724541954796421151'
								},
								{
									label: 'Leveling',
									value: 'LEVELING',
									emoji: '724541953978662972'
								},
								{
									label: 'Economy',
									value: 'ECONOMY',
									emoji: '724541954150498335'
								},
								{
									label: 'Working',
									value: 'WORKING',
									emoji: '724541953890320384'
								},
								{
									label: 'Gambling',
									value: 'GAMBLING',
									emoji: '724541954066743347'
								},
								{
									label: 'More Golds',
									value: 'MORE_GOLDS',
									emoji: '729535888912154754'
								},
								{
									label: 'Others',
									value: 'OTHERS',
									emoji: '864020382033772554'
								}
							])
							.setCustomId(`Help:CATEGORY:${interaction.user.id}`)
							.setMaxValues(1)
							.setMinValues(0)
							.setPlaceholder('Category details')
					),
					new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel(await resolveKey(interaction, 'common:links', { lng: locale }))
							.setStyle('LINK')
							.setURL('https://linktr.ee/mzato0001')
					)
				];
			}
		}

		await interaction.editReply({ embeds: [embed], components });
	}

	private async fuse(interaction: Interaction) {
		const locale = (await this.container.i18n.fetchLanguage(interaction)) || 'en-US';
		return new Fuse(
			ITEMS.filter((i) => !EQUIPMENTS.some((eq) => eq.name.toLowerCase() === i.name.toLowerCase()))
				.map((i) => ({
					label: this.container.i18n.format(locale, `glossary:items.${i.name}.name`),
					name: i.name,
					type: 'ITEMS',
					aliases: [i.name],
					emoji: i.emoji as string | undefined,
					value: i as object
				}))
				.concat(
					HUNTER_SKILLS.map((sk) => ({
						label: this.container.i18n.format(locale, `glossary:skills.${sk.name}.name`),
						name: sk.name,
						type: 'HUNTER_SKILLS',
						aliases: sk.aliases!,
						emoji: sk.emoji,
						value: sk
					}))
				)
				.concat(
					MOB_SKILLS.map((sk) => ({
						label: this.container.i18n.format(locale, `glossary:skills.${sk.name}.name`),
						name: sk.name,
						type: 'MOB_SKILLS',
						aliases: sk.aliases!,
						emoji: sk.emoji,
						value: sk
					}))
				)
				.concat(
					EQUIPMENTS.map((i) => ({
						label: this.container.i18n.format(locale, `glossary:equipments.${i.name}.name`),
						name: i.name,
						type: 'EQUIPMENTS',
						aliases: [i.name],
						emoji: i.emoji as string | undefined,
						value: i
					}))
				)
				.concat(
					MOBS.map((m) => ({
						label: m.name,
						name: m.name,
						type: 'MOBS',
						aliases: [m.name],
						emoji: m.emoji as string | undefined,
						value: m
					}))
				)
				.concat(
					new Collection(Object.entries(CLASSES_INFO)).map((v, k) => ({
						label: this.container.i18n.format(locale, `common:${k.toLowerCase()}`),
						name: k,
						type: 'CLASSES',
						aliases: [k],
						emoji: EMOJIS.CLASSES[CLASSES[k as 'Assassin']],
						value: v
					}))
				)
				.concat(
					new Collection(Object.entries(COMMANDS.HELP.TERMS)).map((v, k) => ({
						label: this.container.i18n.format(locale, `glossary:terms.${k}.name`),
						name: k,
						type: 'TERMS',
						aliases: (v as any)?.ALIASES?.replace(/'|`/g, '').split(' | ') ?? [k],
						emoji: undefined,
						value: v
					}))
				)
				.concat(
					new Collection(Object.entries(COMMANDS.HELP))
						.filter((_v, k) => !['DESCRIPTION', 'CLASSES', 'TERMS'].includes(k))
						.reduce((t, v) => t.concat(new Collection(Object.entries(v))), new Collection<string, { ALIASES: string }>())
						.map((cmd, name) => ({
							label: name.toLowerCase(),
							name: name.toLowerCase(),
							type: 'COMMANDS',
							aliases: cmd.ALIASES.replace(/'|`/g, '').split(' | '),
							emoji: undefined,
							value: cmd
						}))
				),
			{
				// eslint-disable-next-line prettier/prettier
				keys: ['label', 'name', 'aliases'],
				threshold: 0.7,
				fieldNormWeight: 1
			}
		);
	}
}
