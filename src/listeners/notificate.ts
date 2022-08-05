import { Command, Listener } from '@sapphire/framework';

export default class UserListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'chatInputCommandFinish'
		});
	}

	public async run(interaction: Command.ChatInputInteraction<'cached'>) {
		await this.container.notifications.notificate(interaction);
	}
}

declare module '@sapphire/framework' {
	interface ListenerStore {
		get(name: 'Notificate'): UserListener;
	}
}
