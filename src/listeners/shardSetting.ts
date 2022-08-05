import { Listener } from '@sapphire/framework';

export default class UserListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'ready'
		});
	}

	public async run() {
		let guilds = await this.container.db
			.collection('guild')
			.find({}, { projection: { gid: 0 } })
			.map(({ gid }) => gid)
			.toArray();

		guilds = (await this.container.client.guilds.fetch()).map((guild) => guild.id).filter((guild) => !guilds.includes(guild));

		if (!guilds.length) return;

		await this.container.db
			.collection('guild')
			.updateMany({ gid: { $in: guilds } }, { $set: { shardId: this.container.client.guilds.cache.first()?.shardId } });
	}
}

declare module '@sapphire/framework' {
	interface ListenerStore {
		get(name: 'ShardSetting'): UserListener;
	}
}
