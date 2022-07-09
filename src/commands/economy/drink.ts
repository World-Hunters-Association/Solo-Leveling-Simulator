import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';

import type { CommandInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'drink',
	preconditions: ['EphemeralDefer', 'IsHunter'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder();

		this.container.functions.setNameAndDescriptions(builder, ['common:drink', 'validation:help.desccriptions.commands.DRINK']);

		registry.registerChatInputCommand(builder, {
			idHints: ['987561568227176478'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		await this.container.stores
			.get('commands')
			.get('use')
			.use(interaction, 'mana potion', await this.container.i18n.fetchLanguageWithDefault(interaction));
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'drink'): UserCommand;
	}
}
