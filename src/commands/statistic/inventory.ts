import { CommandInteraction, MessageEmbed } from 'discord.js';

import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandUserOption } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';

@ApplyOptions<CommandOptions>({
	name: 'inventory',
	preconditions: ['IsHunter', 'IsMentionHunter'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder().addBooleanOption(new SlashCommandBooleanOption()).addUserOption(new SlashCommandUserOption());

		this.container.functions.setNameAndDescriptions(
			builder,
			['common:inventory', 'validation:help.desccriptions.commands.INVENTORY'],
			['common:show', 'common:descriptions.showInventory'],
			['common:hunter', 'common:descriptions.hunterInventory']
		);

		registry.registerChatInputCommand(builder, {
			idHints: ['987561658752847952'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		await interaction.deferReply({ ephemeral: !interaction.options.getBoolean('show') ?? true });

		// TODO: WHA Staffs can see all inventories
		// TODO: Only show your own inventory
		// TODO: Lottery tickets

		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);

		const target = interaction.options.getUser('hunter');
		const tid = target?.id || interaction.user.id;
		const { name } = (await this.container.db.collection('hunterinfo').findOne({ uid: tid }))!;
		const keys = Object.entries((await this.container.db.collection('keys').findOne({ uid: tid }))!.keys).filter(([, v]) => v > 0);
		const potions = Object.entries((await this.container.db.collection('potions').findOne({ uid: tid }))!.potions).filter(([, v]) => v > 0);
		const stones = Object.entries((await this.container.db.collection('stone').findOne({ uid: tid }))!.stones).filter(([, v]) => v > 0);
		const boxes = Object.entries((await this.container.db.collection('boxes').findOne({ uid: tid }))!.boxes).filter(([, v]) => v > 0);
		const recover = (await this.container.db.collection('recover').findOne({ uid: tid }))!;
		const materials = Object.entries((await this.container.db.collection('material').findOne({ uid: tid }))!.materials).filter(([, v]) => v > 0);

		const c = potions.concat(stones, boxes, [['Status Recovery', recover.has ? 1 : 0]]);
		const consumables = this.container.constants.ITEMS.filter((item) => item.category === 'Consumables')
			.filter((item) => c.some(([k]) => k === item.name))
			.map((item) => ({ amount: c.find(([k]) => k === item.name)![1], ...item }))
			.sort((a, b) => a.weight - b.weight);

		const k = this.container.constants.ITEMS.filter((item) => item.category === 'Keys')
			.filter((item) => keys.some(([k]) => k === item.name))
			.map((item) => ({ amount: keys.find(([k]) => k === item.name)![1], ...item }))
			.sort((a, b) => a.weight - b.weight);

		const embed = new MessageEmbed().setColor('BLUE').setAuthor({
			name: await resolveKey(interaction, 'validation:inventory.author', { name, lng: locale }),
			iconURL: (target ? target : interaction.user).displayAvatarURL({ dynamic: true })
		});

		if (keys.length)
			embed.addField(
				await resolveKey(interaction, 'common:keys', { lng: locale }),
				(
					await Promise.all(
						k.map(async ({ amount, name }) =>
							resolveKey(interaction, 'validation:inventory.item', { name, emoji: `$t(constant:emojis.keys.${name})`, amount })
						)
					)
				).join('\n'),
				true
			);
		if (consumables.length)
			embed.addField(
				await resolveKey(interaction, 'common:consumables', { lng: locale }),
				(
					await Promise.all(
						consumables.map(async ({ name, emoji, amount }) =>
							resolveKey(interaction, 'validation:inventory.item', {
								name,
								emoji,
								amount
							})
						)
					)
				).join('\n'),
				true
			);
		if (materials.length)
			embed.addField(
				await resolveKey(interaction, 'common:materials', { lng: locale }),
				(
					await Promise.all(
						materials.map(async ([k, v]) =>
							resolveKey(interaction, 'validation:inventory.item', { name: k, emoji: `$t(constant:emojis.materials.${k})`, amount: v })
						)
					)
				)
					.sort()
					.join('\n'),
				true
			);

		if (embed.fields.length === 0) embed.setDescription('none');

		await interaction.editReply({ embeds: [embed] });
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'inventory'): UserCommand;
	}
}
