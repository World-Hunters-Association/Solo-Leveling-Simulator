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
import { editLocalized, resolveKey } from '@sapphire/plugin-i18next';

import { BaseStats, CLASSES, CLASSES_INFO, EMOJIS, STATS } from '../../lib/constants';
import { HUNTER_SKILLS } from '../../lib/structures/skills';

@ApplyOptions<CommandOptions>({
	name: 'chooseclass',
	description: 'Choose hunter class',
	preconditions: ['Defer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class ChooseClassCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand(new SlashCommandBuilder().setName(this.name).setDescription(this.description), {
			idHints: ['971018017678958602'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const uid = interaction.user.id;
		const result = await this.container.db.collection('hunterinfo').findOne({ uid });

		if (result?.classid !== 6) {
			await editLocalized(interaction, 'validation:chooseClass.twice');
			return;
		}

		await this.container.db.collection('busy').insertOne({ uid, reason: 'chooseClass' });

		const embedGenerator = async () => {
			return new MessageEmbed()
				.setTitle((await resolveKey(interaction, 'common:chooseClass')).toUpperCase())
				.setColor('BLUE')
				.setTimestamp()
				.setDescription(await resolveKey(interaction, 'validation:chooseClass.descriptions.embed'));
		};

		const componentsGenerator = async () => [
			new MessageActionRow().addComponents([
				new MessageSelectMenu()
					.setCustomId(`chooseClass:Classes:${uid}`)
					.setMaxValues(1)
					.setPlaceholder(await resolveKey(interaction, 'common:selectMenuPlaceholder'))
					.addOptions([
						{
							label: await resolveKey(interaction, 'common:assassin'),
							value: 'Assassin',
							emoji: '741716520920678451',
							description: (await resolveKey(interaction, 'validation:chooseClass.descriptions.assassin')).replace(
								/^(.{0,96}).*/,
								'$1...'
							)
						},
						{
							label: await resolveKey(interaction, 'common:fighter'),
							value: 'Fighter',
							emoji: '741716521147170836',
							description: (await resolveKey(interaction, 'validation:chooseClass.descriptions.fighter')).replace(
								/^(.{0,96}).*/,
								'$1...'
							)
						},
						{
							label: await resolveKey(interaction, 'common:tanker'),
							value: 'Tanker',
							emoji: '741716521365274654',
							description: (await resolveKey(interaction, 'validation:chooseClass.descriptions.tanker')).replace(
								/^(.{0,96}).*/,
								'$1...'
							)
						},
						{
							label: await resolveKey(interaction, 'common:healer'),
							value: 'Healer',
							emoji: '741716521088188476',
							description: (await resolveKey(interaction, 'validation:chooseClass.descriptions.healer')).replace(
								/^(.{0,96}).*/,
								'$1...'
							)
						},
						{
							label: await resolveKey(interaction, 'common:mage'),
							value: 'Mage',
							emoji: '741716521109159996',
							description: (await resolveKey(interaction, 'validation:chooseClass.descriptions.mage')).replace(/^(.{0,96}).*/, '$1...')
						},
						{
							label: await resolveKey(interaction, 'common:ranger'),
							value: 'Ranger',
							emoji: '741716521083994255',
							description: (await resolveKey(interaction, 'validation:chooseClass.descriptions.ranger')).replace(
								/^(.{0,96}).*/,
								'$1...'
							)
						}
					])
			]),
			new MessageActionRow().addComponents([
				new MessageButton()
					.setLabel(await resolveKey(interaction, 'common:cancel'))
					.setEmoji('🛑')
					.setCustomId(`chooseClass:Cancel:${uid}`)
					.setStyle('DANGER')
			])
		];

		const message = await interaction.editReply({ embeds: [await embedGenerator()], components: await componentsGenerator() });

		const collector = (message as Message).createMessageComponentCollector({
			filter: (i) => i.user.id === interaction.user.id,
			time: 1000 * 60 * 10
		});

		collector.on('collect', async (i) => {
			await i.deferUpdate();
			switch (i.customId.split(':')[1]) {
				case 'Cancel': {
					const embed = await embedGenerator();
					const components = await componentsGenerator();

					embed.setDescription(await resolveKey(interaction, 'validation:chooseClass.descriptions.cancelled'));

					components.forEach((row) => row.components.forEach((co) => co.setDisabled(true)));

					await i.editReply({ embeds: [embed], components });

					await this.container.db.collection('busy').deleteOne({ uid });
					break;
				}
				case 'Yes': {
					const embed = await embedGenerator();
					const components = await componentsGenerator();

					embed.setDescription(await resolveKey(interaction, 'validation:chooseClass.descriptions.confirmed'));

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
								.setLabel(await resolveKey(i, 'common:yes'))
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
					const embed = await embedGenerator();
					const components = await componentsGenerator();
					const $class = (i as SelectMenuInteraction).values[0];
					const classInfo = CLASSES_INFO[$class.toUpperCase() as 'ASSASSIN'];
					const [big, small] = new Collection(Object.entries(classInfo.BASE_STATS)).partition(
						(_value, key, coll) => coll.map((_v, k) => k).indexOf(key) <= Math.ceil(coll.size / 2) - 1
					);
					const skills = HUNTER_SKILLS.filter((skill) => skill.class === CLASSES[$class as 'Assassin']);

					embed
						.setDescription(await resolveKey(i, 'validation:chooseClass.descriptions.confirm'))
						.addField(
							await resolveKey(interaction, `common:${$class.toLowerCase()}`),
							await resolveKey(i, `validation:chooseClass.descriptions.${$class.toLowerCase()}`)
						)
						.addFields([
							{
								name: await resolveKey(i, 'common:baseStats'),
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
								name: await resolveKey(i, 'common:skills'),
								value: (
									await Promise.all(
										skills
											.filter((_skill, ind) => ind <= Math.ceil(skills.length / 2) - 1)
											.map(async (skill) => `${skill.emoji} **${await resolveKey(i, `glossary:skills.${skill.name}.name`)}**`)
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
											.map(async (skill) => `${skill.emoji} **${await resolveKey(i, `glossary:skills.${skill.name}.name`)}**`)
									)
								).join('\n'),
								inline: true
							},
							{ name: '** **', value: '** **', inline: true }
						])
						.setThumbnail(`https://cdn.discordapp.com/emojis/${classInfo.EMOJI?.split(':')[2].replace('>', '')}.png`);

					components[1].addComponents([
						new MessageButton()
							.setLabel(await resolveKey(i, 'common:yes'))
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
				const components = await componentsGenerator();
				components.forEach((c) => c.components.forEach((co) => co.setDisabled(true)));
				await (message as Message).edit({ embeds: [await embedGenerator()], components });
				await this.container.db.collection('busy').deleteOne({ uid });
			}
		});
	}
}
