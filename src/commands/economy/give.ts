import { SlashCommandBuilder, SlashCommandNumberOption, SlashCommandUserOption } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { editLocalized } from '@sapphire/plugin-i18next';

import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'give',
	preconditions: ['Defer', 'IsHunter', 'IsMentionHunter'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder()
			.addUserOption(new SlashCommandUserOption().setRequired(true))
			.addNumberOption(new SlashCommandNumberOption().setRequired(true).setAutocomplete(true));

		this.container.functions.setNameAndDescriptions(
			builder,
			['common:give', 'validation:help.desccriptions.commands.GIVE'],
			['common:hunter', 'common:descriptions.giveHunter'],
			['common:quantity', 'common:descriptions.giveQuantity']
		);

		registry.registerChatInputCommand(builder, {
			idHints: ['992869212018180096'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);

		const user = interaction.options.getUser(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);

		if (user.id === interaction.user.id) {
			await editLocalized(interaction, { keys: 'validation:give.self', formatOptions: { lng: locale } });
			return;
		}

		const { name } = (await this.container.db.collection('hunterinfo').findOne({ uid: user.id }))!;

		const { gold } = (await this.container.db.collection('money').findOne({ uid: interaction.user.id }))!;
		const quantity = Math.abs(
			Math.floor(Number(interaction.options.getNumber(this.container.i18n.format('en-US', 'common:quantity').toLowerCase())))
		);

		if (quantity > gold || quantity < 1) {
			await editLocalized(interaction, { keys: 'validation:give.notEnoughGold', formatOptions: { lng: locale } });
			return;
		}

		await Promise.all([
			this.container.db.collection('money').updateOne({ uid: interaction.user.id }, { $inc: { gold: -quantity } }),
			this.container.db.collection('money').updateOne({ uid: user.id }, { $inc: { gold: quantity } })
		]);
		await editLocalized(interaction, {
			keys: 'validation:give.success',
			formatOptions: { lng: locale, name, quantity: `$t(glossary:currencies.gold, {"count":${quantity},"context":"count"})` }
		});
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'give'): UserCommand;
	}
}
