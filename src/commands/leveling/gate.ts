import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { ApplicationCommandOptionType } from 'discord-api-types/v9';

@ApplyOptions<CommandOptions>({
	name: 'gate',
	preconditions: ['Defer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder();

		this.container.functions.setNameAndDescriptions(
			builder,
			['common:gate', 'validation:help.desccriptions.commands.GATE'],
			[
				'common:keys',
				'common:descriptions.gateKey',
				[
					'common:key.E',
					'common:key.D',
					'common:key.C',
					'common:key.B',
					'common:key.A',
					'common:key.S',
					'common:key.SS',
					'common:key.Uprank'
				],
				{ type: ApplicationCommandOptionType['String'] },
				'String'
			]
		);

		registry.registerChatInputCommand(builder, {
			idHints: [''],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: Command.ChatInputInteraction<'cached'>) {}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'gate'): UserCommand;
	}
}
