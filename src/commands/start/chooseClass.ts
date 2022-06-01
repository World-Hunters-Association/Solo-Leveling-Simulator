import {
	Collection,
	CommandInteraction,
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageSelectMenu,
	SelectMenuInteraction
} from 'discord.js';

import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { editLocalized } from '@sapphire/plugin-i18next';

import { CLASSES, STATS } from '../../utils/constants';

@ApplyOptions<CommandOptions>({
	name: 'chooseclass',
	description: 'Choose hunter class',
	preconditions: ['Defer', 'IsHunter'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder();

		this.container.functions.setNameAndDescriptions(builder, ['common:chooseClass', 'validation:help.desccriptions.commands.CHOOSE_CLASS']);

		registry.registerChatInputCommand(builder, {
			idHints: ['971018017678958602'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const { BaseStats, CLASSES_INFO, EMOJIS, HUNTER_SKILLS } = this.container.constants;

		const uid = interaction.user.id;
		const result = await this.container.db.collection('hunterinfo').findOne({ uid });
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);

		if (result?.classid !== 6) {
			await editLocalized(interaction, 'validation:chooseClass.twice');
			return;
		}

		await this.container.db.collection('busy').insertOne({ uid, reason: 'chooseClass' });

		const embedGenerator = () => {
			return new MessageEmbed()
				.setTitle(this.container.i18n.getT(locale)('common:chooseClass').toUpperCase())
				.setColor('BLUE')
				.setTimestamp()
				.setDescription(this.container.i18n.getT(locale)('validation:chooseClass.descriptions.embed'));
		};

		const componentsGenerator = () => [
			new MessageActionRow().addComponents([
				new MessageSelectMenu()
					.setCustomId(`chooseClass:Classes:${uid}`)
					.setMaxValues(1)
					.setPlaceholder(this.container.i18n.getT(locale)('common:selectMenuPlaceholder'))
					.addOptions([
						{
							label: this.container.i18n.getT(locale)('common:assassin'),
							value: 'Assassin',
							emoji: '741716520920678451',
							description: this.container.i18n
								.getT(locale)('validation:chooseClass.descriptions.assassin')
								.replace(/^(.{0,96}).*/, '$1...')
						},
						{
							label: this.container.i18n.getT(locale)('common:fighter'),
							value: 'Fighter',
							emoji: '741716521147170836',
							description: this.container.i18n
								.getT(locale)('validation:chooseClass.descriptions.fighter')
								.replace(/^(.{0,96}).*/, '$1...')
						},
						{
							label: this.container.i18n.getT(locale)('common:tanker'),
							value: 'Tanker',
							emoji: '741716521365274654',
							description: this.container.i18n
								.getT(locale)('validation:chooseClass.descriptions.tanker')
								.replace(/^(.{0,96}).*/, '$1...')
						},
						{
							label: this.container.i18n.getT(locale)('common:healer'),
							value: 'Healer',
							emoji: '741716521088188476',
							description: this.container.i18n
								.getT(locale)('validation:chooseClass.descriptions.healer')
								.replace(/^(.{0,96}).*/, '$1...')
						},
						{
							label: this.container.i18n.getT(locale)('common:mage'),
							value: 'Mage',
							emoji: '741716521109159996',
							description: this.container.i18n
								.getT(locale)('validation:chooseClass.descriptions.mage')
								.replace(/^(.{0,96}).*/, '$1...')
						},
						{
							label: this.container.i18n.getT(locale)('common:ranger'),
							value: 'Ranger',
							emoji: '741716521083994255',
							description: this.container.i18n
								.getT(locale)('validation:chooseClass.descriptions.ranger')
								.replace(/^(.{0,96}).*/, '$1...')
						}
					])
			]),
			new MessageActionRow().addComponents([
				new MessageButton()
					.setLabel(this.container.i18n.getT(locale)('common:cancel'))
					.setEmoji('🛑')
					.setCustomId(`chooseClass:Cancel:${uid}`)
					.setStyle('DANGER')
			])
		];

		const message = await interaction.editReply({ embeds: [embedGenerator()], components: componentsGenerator() });

		const collector = (message as Message).createMessageComponentCollector({
			filter: (i) => i.user.id === interaction.user.id,
			time: 1000 * 60 * 10
		});

		collector.on('collect', async (i) => {
			await i.deferUpdate();
			switch (i.customId.split(':')[1]) {
				case 'Cancel': {
					const embed = embedGenerator();
					const components = componentsGenerator();

					embed.setDescription(this.container.i18n.getT(locale)('validation:chooseClass.descriptions.cancelled'));

					components.forEach((row) => row.components.forEach((co) => co.setDisabled(true)));

					await i.editReply({ embeds: [embed], components });

					await this.container.db.collection('busy').deleteOne({ uid });
					break;
				}
				case 'Yes': {
					const embed = embedGenerator();
					const components = componentsGenerator();

					embed.setDescription(this.container.i18n.getT(locale)('validation:chooseClass.descriptions.confirmed'));

					const baseStats = { ...BaseStats[CLASSES[Number(i.customId.split(':')[2])] as 'Assassin'] };
					const stats = {
						str: baseStats.str - 10,
						int: baseStats.int - 10,
						agi: baseStats.agi - 10,
						vit: baseStats.vit - 10,
						def: baseStats.def - 10,
						mr: baseStats.mr - 10
					};

					const skills: { [key: string]: number } = {};
					HUNTER_SKILLS.filter((skill) => skill.class === Number(i.customId.split(':')[2])).forEach((skill) => (skills[skill.name] = 0));

					await Promise.all([
						this.container.db
							.collection('hunterinfo')
							.updateOne({ uid: interaction.user.id }, { $set: { classid: Number(i.customId.split(':')[2]) } }),
						this.container.db.collection('busy').deleteOne({ uid: interaction.user.id }),
						this.container.db.collection('hunter_skills').updateOne({ uid: interaction.user.id }, { $set: { skills } }),
						this.container.db.collection('hunterstats').updateOne({ uid: interaction.user.id }, { $inc: stats })
					]);

					components[1]
						.addComponents([
							new MessageButton()
								.setLabel(this.container.i18n.getT(locale)('common:yes'))
								.setEmoji(EMOJIS.UI.YES)
								.setCustomId(`chooseClass:Yes:${interaction.user.id}`)
								.setStyle('SECONDARY')
								.setDisabled(true)
						])
						.components[0].setDisabled(true);

					components[0].components[0].setDisabled(true);

					await i.editReply({ embeds: [embed], components });
					break;
				}
				default: {
					const embed = embedGenerator();
					const components = componentsGenerator();
					const $class = (i as SelectMenuInteraction).values[0];
					const classInfo = CLASSES_INFO[$class.toUpperCase() as 'ASSASSIN'];
					const [big, small] = new Collection(Object.entries(classInfo.BASE_STATS)).partition(
						(_value, key, coll) => coll.map((_v, k) => k).indexOf(key) <= Math.ceil(coll.size / 2) - 1
					);
					const skills = HUNTER_SKILLS.filter((skill) => skill.class === CLASSES[$class as 'Assassin']);

					embed
						.setDescription(this.container.i18n.getT(locale)('validation:chooseClass.descriptions.confirm'))
						.addField(
							this.container.i18n.getT(locale)(`common:${$class.toLowerCase()}`),
							this.container.i18n.getT(locale)(`validation:chooseClass.descriptions.${$class.toLowerCase()}`)
						)
						.addFields([
							{
								name: this.container.i18n.getT(locale)('common:baseStats'),
								value: big
									.map(
										(value, key) =>
											`${EMOJIS.STATS[STATS[key as 'agi']?.toUpperCase().replace(/ /g, '_') as 'AGILITY']} **${key.replace(
												/^\w/,
												(l) => l.toUpperCase()
											)}**: ${value}`
									)
									.join('\n'),
								inline: true
							},
							{
								name: '** **',
								value: small
									.map(
										(value, key) =>
											`${EMOJIS.STATS[STATS[key as 'agi']?.toUpperCase().replace(/ /g, '_') as 'AGILITY']} **${key.replace(
												/^\w/,
												(l) => l.toUpperCase()
											)}**: ${value}`
									)
									.join('\n'),
								inline: true
							},
							{ name: '** **', value: '** **', inline: true },
							{
								name: this.container.i18n.getT(locale)('common:skills'),
								value: (
									await Promise.all(
										skills
											.filter((_skill, ind) => ind <= Math.ceil(skills.length / 2) - 1)
											.map(
												(skill) =>
													`${skill.emoji} **${this.container.i18n.getT(locale)(`glossary:skills.${skill.name}.name`)}**`
											)
									)
								).join('\n'),
								inline: true
							},
							{
								name: '** **',
								value: (
									await Promise.all(
										skills
											.filter((_skill, ind) => ind > Math.ceil(skills.length / 2) - 1)
											.map(
												(skill) =>
													`${skill.emoji} **${this.container.i18n.getT(locale)(`glossary:skills.${skill.name}.name`)}**`
											)
									)
								).join('\n'),
								inline: true
							},
							{ name: '** **', value: '** **', inline: true }
						])
						.setThumbnail(`https://cdn.discordapp.com/emojis/${classInfo.EMOJI?.split(':')[2].replace('>', '')}.png`);

					components[1].addComponents([
						new MessageButton()
							.setLabel(this.container.i18n.getT(locale)('common:yes'))
							.setEmoji(EMOJIS.UI.YES)
							.setCustomId(`chooseClass:Yes:${CLASSES[$class as 'Assassin']}:${interaction.user.id}`)
							.setStyle('SECONDARY')
							.setDisabled(false)
					]);

					await i.editReply({ embeds: [embed], components });
				}
			}
		});

		collector.on('end', async (_collected, reason) => {
			if (reason === 'time') {
				const components = componentsGenerator();
				components.forEach((c) => c.components.forEach((co) => co.setDisabled(true)));
				await (message as Message).edit({ embeds: [embedGenerator()], components });
				await this.container.db.collection('busy').deleteOne({ uid });
			}
		});
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'chooseclass'): UserCommand;
	}
}
