import { SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { editLocalized } from '@sapphire/plugin-i18next';

import type { AutocompleteInteraction, CommandInteraction } from 'discord.js';
import Fuse from 'fuse.js';
import type { Keys, Material, Potions } from '../../lib/structures/schemas';
import type { Drops, Items } from '../../utils/constants';

@ApplyOptions<CommandOptions>({
	name: 'sell',
	preconditions: ['EphemeralDefer', 'IsHunter'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder()
			.addStringOption(new SlashCommandStringOption().setRequired(true).setAutocomplete(true))
			.addNumberOption(new SlashCommandNumberOption().setAutocomplete(true));

		this.container.functions.setNameAndDescriptions(
			builder,
			['common:sell', 'validation:help.desccriptions.commands.SELL'],
			['common:item', 'common:descriptions.sellItem'],
			['common:quantity', 'common:descriptions.sellQuantity']
		);

		registry.registerChatInputCommand(builder, {
			idHints: [''],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async autocompleteRun(interaction: AutocompleteInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		const { name, value } = interaction.options.getFocused(true);
		switch (name) {
			case this.container.i18n.format('en-US', 'common:item').toLowerCase():
				await interaction.respond(
					this.fuse(locale)
						.search({ $or: [{ label: `${value}` }, { name: `${value}` }] }, { limit: 25 })
						.map((result) => ({
							name: result.item.label,
							value: result.item.name,
							emoji: result.item.emoji
						}))
				);
				break;
			case this.container.i18n.format('en-US', 'common:quantity').toLowerCase(): {
				const _value = Math.abs(Math.floor(Number(value) || 0));
				const item = this.container.constants.ITEMS.find(
					(i) => i.name === interaction.options.getString(this.container.i18n.format('en-US', 'common:item').toLowerCase())
				);
				const drop = this.container.constants.DROPS.find(
					(i) => i.name === interaction.options.getString(this.container.i18n.format('en-US', 'common:item').toLowerCase())
				);

				// TODO: Equipments

				if (!item && !drop) {
					await interaction.respond([
						{
							name: this.container.functions.reduceString(
								this.container.i18n.format(locale, 'common:missingField', {
									fields: this.container.i18n.format('en-US', 'common:item').toLowerCase()
								}),
								100
							),
							value: -1
						}
					]);
					return;
				}

				const doc = (await this.container.db
					.collection(Boolean(drop) ? 'material' : item?.type === 'potion' ? 'potions' : 'keys')
					.findOne({ uid: interaction.user.id }))!;

				const has = Boolean(drop)
					? (doc as Material).materials[drop!.name]
					: item?.type === 'potion'
					? (doc as Potions).potions[item!.name as keyof Potions['potions']]
					: (doc as Keys).keys[item!.name as keyof Keys['keys']];

				await interaction.respond(
					[
						{
							name: this.container.i18n.format(locale, 'validation:sell.quantity', {
								quantity: has,
								currency: `$t(glossary:currencies.gold, {"count":${
									has * (Boolean(drop) ? drop : item)!.sellPrice!
								},"context":"count"})`
							}),
							value: has
						}
					].concat(
						[1, 10, 100, 1000]
							.filter((v) => v * Number(_value) <= has && Number(_value) !== 0)
							.map((v) => ({
								name: this.container.i18n.format(locale, 'validation:sell.quantity', {
									quantity: v * Number(_value),
									currency: `$t(glossary:currencies.gold, {"count":${
										v * Number(_value) * (Boolean(drop) ? drop : item)!.sellPrice!
									},"context":"count"})`
								}),
								value: v * Number(_value)
							}))
					)
				);
			}
		}
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		const item = this.container.constants.ITEMS.find(
			(i) => i.name === interaction.options.getString(this.container.i18n.format('en-US', 'common:item').toLowerCase())
		);
		const drop = this.container.constants.DROPS.find(
			(i) => i.name === interaction.options.getString(this.container.i18n.format('en-US', 'common:item').toLowerCase())
		);

		// TODO: Equipments

		const quantity = interaction.options.getNumber(this.container.i18n.format('en-US', 'common:quantity').toLowerCase()) || 1;

		if (!item && !drop) {
			await editLocalized(interaction, {
				keys: 'common:missingField',
				formatOptions: {
					fields: this.container.i18n.format('en-US', 'common:item').toLowerCase(),
					lng: locale
				}
			});
			return;
		}

		if (quantity < 0) {
			await editLocalized(interaction, {
				keys: 'common:notEnough',
				formatOptions: {
					what: `$t(glossary:currencies.gold, {"count":${(Boolean(drop) ? item : drop)!.sellPrice}})`,
					lng: locale
				}
			});
			return;
		}

		if (Boolean(drop))
			await this.container.db.collection('material').updateOne({ uid: interaction.user.id }, { $inc: { [drop!.name]: -quantity } });
		else if (item?.type === 'potion')
			await this.container.db
				.collection('potions')
				.updateOne({ uid: interaction.user.id }, { $inc: { [item!.name as keyof Potions['potions']]: -quantity } });
		else if (item?.type === 'key')
			await this.container.db
				.collection('keys')
				.updateOne({ uid: interaction.user.id }, { $inc: { [item!.name as keyof Keys['keys']]: -quantity } });

		await this.container.db
			.collection('money')
			.updateOne({ uid: interaction.user.id }, { $inc: { gold: quantity * (Boolean(drop) ? drop : item)!.sellPrice! } });
		await editLocalized(interaction, {
			keys: 'validation:sell.success',
			formatOptions: {
				lng: locale,
				quantity,
				emoji: (Boolean(drop) ? item : drop)!.emoji,
				name: (Boolean(drop) ? item : drop)!.name,
				currency: `$t(glossary:currencies.gold, {"count":${quantity * (Boolean(drop) ? drop : item)!.sellPrice!},"context":"count"})`
			}
		});
	}

	public fuse(locale: string) {
		return new Fuse(
			this.container.constants.ITEMS.filter((i) => isFinite(i.sellPrice || Infinity))
				.map((i) => ({
					label:
						i.category === 'Equipment'
							? this.container.i18n.format(locale, `glossary:equipments.${i.name}.name`)
							: this.container.i18n.format(locale, `glossary:items.${i.name}.name`),
					name: i.name,
					emoji: i.emoji,
					value: i as Items | Drops
				}))
				.concat(
					this.container.constants.DROPS.filter((i) => isFinite(i.sellPrice || Infinity)).map((m) => ({
						label: this.container.i18n.format(locale, `glossary:materials.${m.name}.name`),
						name: m.name,
						emoji: m.emoji,
						value: m as Items | Drops
					}))
				),
			{ keys: ['label', 'name'], threshold: 0.7, fieldNormWeight: 1 }
		);
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'sell'): UserCommand;
	}
}
