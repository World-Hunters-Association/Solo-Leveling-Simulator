import { ChatInputCommandDeniedPayload, Listener, UserError } from '@sapphire/framework';
import { editLocalized } from '@sapphire/plugin-i18next';

export default class ChatInputCommandDeniedListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			name: 'chatInputCommandDenied',
			event: 'chatInputCommandDenied'
		});
	}

	public async run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		if (error.identifier === 'IsHunter')
			await editLocalized(interaction, {
				keys: 'validation:awake.request',
				formatOptions: { mention: interaction.user.toString(), lng: locale }
			});
		if (error.identifier === 'IsMentionHunter')
			await editLocalized(interaction, {
				keys: 'validation:mentionNotHunter',
				formatOptions: { mention: (error.context as any).user.tag, lng: locale }
			});
		if (error.identifier === 'preconditionCooldown') await this.container.functions.sendRetryMessage(interaction);
	}
}
