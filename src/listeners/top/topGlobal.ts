import { Listener } from '@sapphire/framework';
import { scheduleJob } from 'node-schedule';
export default class UserListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'ready'
		});
	}

	public async run() {
		await this.update(new Date());
		scheduleJob('Fetch leaderboard data', `*/30 * * * *`, async (date) => {
			await this.update(date);
		});
	}

	private async update(date: Date) {
		await this.container.db
			.collection('top')
			.updateOne(
				{ gid: this.container.client.user?.id },
				{ $set: { date, top: await this.container.stores.get('listeners').get('topLocal').fetchData() } },
				{ upsert: true }
			);
	}
}

declare module '@sapphire/framework' {
	interface ListenerStore {
		get(name: 'topGlobal'): UserListener;
	}
}
