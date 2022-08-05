import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';

@ApplyOptions<CommandOptions>({
	name: 'notification',
	preconditions: ['EphemeralDefer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder();

		this.container.functions.setNameAndDescriptions(builder, ['common:notification', 'validation:help.desccriptions.commands.NOTIFICATION']);

		registry.registerChatInputCommand(builder, {
			idHints: ['1000281765698601000'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction<'cached'>) {
		await this.container.notifications.list(interaction);
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'notification'): UserCommand;
	}
}
