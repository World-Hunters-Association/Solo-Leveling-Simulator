import { ChatInputCommandDeniedPayload, Listener, UserError } from '@sapphire/framework';
import { editLocalized } from '@sapphire/plugin-i18next';

export default class CommandDeniedListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			name: 'CommandDenied',
			event: 'chatInputCommandDenied'
		});
	}

	public async run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		if (error.identifier !== 'IsHunter') return;
		await editLocalized(interaction, { keys: 'awake:request', formatOptions: { mention: interaction.user.toString() } });
	}
}
