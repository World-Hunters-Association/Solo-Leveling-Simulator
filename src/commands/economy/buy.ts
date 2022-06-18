import Fuse from 'fuse.js';

import { SlashCommandBuilder, SlashCommandNumberOption, SlashCommandStringOption } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, container, RegisterBehavior } from '@sapphire/framework';
import { editLocalized, resolveKey } from '@sapphire/plugin-i18next';

import type { AutocompleteInteraction, CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'buy',
	description: container.i18n.format('en-US', 'validation:help.desccriptions.commands.BUY'),
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
			['common:buy', 'validation:help.desccriptions.commands.BUY'],
			['common:item', 'common:descriptions.buyItem'],
			['common:quantity', 'common:descriptions.buyQuantity']
		);

		registry.registerChatInputCommand(builder, {
			idHints: ['927958034184024064'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async autocompleteRun(interaction: AutocompleteInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		let { name, value } = interaction.options.getFocused(true);
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
				value = Math.abs(Math.floor(Number(value)));
				const money = await this.container.db.collection('money').findOne({ uid: interaction.user.id });
				const item = this.container.constants.ITEMS.find(
					(i) => i.name === interaction.options.getString(this.container.i18n.format('en-US', 'common:item').toLowerCase())
				);

				if (!item) {
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

				const wallet = money?.[item.currency] || 0;

				if (wallet < item.price) {
					await interaction.respond([
						{
							name: this.container.functions.reduceString(
								this.container.i18n.format(locale, 'common:notEnough', {
									what: `$t(glossary:currencies.${item.currency}, {"count":${item.price}})`
								}),
								100
							),
							value: -1
						}
					]);
					return;
				}

				const choices = [];
				if (wallet >= item.price * 2) {
					const quantity = Math.floor(wallet / item.price);
					choices.push({
						name: this.container.i18n.format(locale, 'validation:buy.max', {
							quantity: Intl.NumberFormat().format(quantity),
							price: Intl.NumberFormat().format(quantity * item.price),
							currency: `$t(glossary:currencies.${item.currency}, {"count":${item.price}})`
						}),
						value: quantity
					});
				}

				if (wallet >= item.price * value && Boolean(value))
					choices.unshift({
						name: this.container.i18n.format(locale, 'validation:buy.quantity', {
							quantity: Intl.NumberFormat().format(value),
							price: Intl.NumberFormat().format(value * item.price),
							currency: `$t(glossary:currencies.${item.currency}, {"count":${item.price}})`
						}),
						value
					});

				await interaction.respond(choices);
			}
		}
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		const item = this.container.constants.ITEMS.find(
			(i) => i.name === interaction.options.getString(this.container.i18n.format('en-US', 'common:item').toLowerCase(), true)
		)!;
		const quantity = interaction.options.getNumber(this.container.i18n.format('en-US', 'common:quantity').toLowerCase()) || 1;

		if (!item) {
			await interaction.editReply(
				this.container.i18n.format(locale, 'common:missingField', {
					fields: this.container.i18n.format('en-US', 'common:item').toLowerCase()
				})
			);
		}

		if (quantity < 0) {
			await interaction.editReply(
				await resolveKey(interaction, 'common:notEnough', {
					what: `$t(glossary:currencies.${item.currency}, {"count":${item.price}})`,
					lng: locale
				})
			);
			return;
		}

		// TODO Lottery ticket

		if (item.type === 'stone')
			await this.container.db.collection('stone').updateOne({ uid: interaction.user.id }, { $inc: { 'stones.thunder stone': quantity } });

		if (this.container.constants.EQUIPMENTS.find((eq) => item.name === eq.name)) {
			const eq = this.container.constants.EQUIPMENTS.find((eq) => item.name === eq.name)!;

			await this.container.db
				.collection('equipment')
				.updateOne({ uid: interaction.user.id }, { $inc: { [`unequipped.${eq.uniqueCode}`]: quantity } }, { upsert: true });
		}

		if (item.type === 'potion')
			await this.container.db.collection('potions').updateOne({ uid: interaction.user.id }, { $inc: { [`potions.${item.name}`]: quantity } });

		if (item.type === 'key')
			await this.container.db.collection('keys').updateOne({ uid: interaction.user.id }, { $inc: { [`keys.${item.name}`]: quantity } });

		await this.container.db.collection('money').updateOne({ uid: interaction.user.id }, { $inc: { [item.currency]: -(item.price! * quantity) } });
		await editLocalized(interaction, {
			keys: 'validation:buy.success',
			formatOptions: {
				lng: locale,
				quantity: Intl.NumberFormat().format(quantity),
				emoji: item.emoji,
				name: item.name,
				price: Intl.NumberFormat().format(item.price * quantity),
				priceCount: item.price * quantity,
				currency: item.currency
			}
		});
	}

	public fuse(locale: string) {
		return new Fuse(
			this.container.constants.ITEMS.filter((i) => isFinite(i.price)).map((i) => ({
				label:
					i.category === 'Equipment'
						? this.container.i18n.format(locale, `glossary:equipments.${i.name}.name`)
						: this.container.i18n.format(locale, `glossary:items.${i.name}.name`),
				name: i.name,
				emoji: i.emoji,
				value: i
			})),
			{ keys: ['label', 'name'], threshold: 0.7, fieldNormWeight: 1 }
		);
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'buy'): UserCommand;
	}
}
