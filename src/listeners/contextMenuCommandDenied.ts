import { ContextMenuCommandDeniedPayload, Listener, UserError } from '@sapphire/framework';

export default class ContextMenuCommandDeniedListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			name: 'contextMenuCommandDenied',
			event: 'contextMenuCommandDenied'
		});
	}

	public async run(error: UserError, { interaction }: ContextMenuCommandDeniedPayload) {
		if (error.identifier === 'preconditionCooldown') await this.container.functions.sendRetryMessage(interaction);
	}
}
