import { Command, Listener } from '@sapphire/framework';
import type { Snowflake } from 'discord.js';

export default class UserListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'chatInputCommandRun'
		});
	}

	/**
	 * ? Only run in guilds where have atleast 1 hunter is playing
	 */
	public async run(interaction: Command.ChatInputInteraction<'cached'>) {
		if (!interaction.guild) return;

		const { date } = (await this.container.db.collection('top').findOne({ gid: interaction.guild.id })) || { date: new Date(0) };
		const now = Date.now();

		if (date.getTime() + 1000 * 60 * 5 > now) return;

		await this.container.db
			.collection('top')
			.updateOne(
				{ gid: interaction.guild.id },
				{ $set: { date: new Date(), top: await this.fetchData(Array.from((await interaction.guild.members.fetch()).keys())) } },
				{ upsert: true }
			);

		interaction.guild.members.cache.clear();
	}

	public async fetchData(uids?: Snowflake[]) {
		const level = await this.container.db
			.collection('hunterstats')
			.aggregate([{ $match: Boolean(uids) ? { uid: { $in: uids } } : {} }, { $sort: { exp: -1 } }, { $limit: Boolean(uids) ? 75 : 15 }])
			.map(({ uid, exp }) => ({ uid, exp, level: this.container.functions.HunterLevelCalc(exp) }))
			.toArray();
		const rank = await this.container.db
			.collection('hunterstats')
			.aggregate([
				{ $match: Boolean(uids) ? { uid: { $in: uids } } : {} },
				{ $lookup: { from: 'hunterinfo', localField: 'uid', foreignField: 'uid', as: 'info' } },
				{ $addFields: { rank: { $sum: '$info.rankid' } } },
				{ $sort: { rank: -1, exp: -1 } },
				{ $limit: Boolean(uids) ? 75 : 15 }
			])
			.map(({ uid, rank }) => ({ uid, rank }))
			.toArray();
		const gold = await this.container.db
			.collection('hunterstats')
			.aggregate([
				{ $match: Boolean(uids) ? { uid: { $in: uids } } : {} },
				{ $lookup: { from: 'money', localField: 'uid', foreignField: 'uid', as: 'money' } },
				{ $addFields: { gold: { $sum: '$money.gold' } } },
				{ $sort: { gold: -1, exp: -1 } },
				{ $limit: Boolean(uids) ? 75 : 15 }
			])
			.map(({ uid, gold }) => ({ uid, gold }))
			.toArray();

		return { level, rank, gold };
	}
}

declare module '@sapphire/framework' {
	interface ListenerStore {
		get(name: 'topLocal'): UserListener;
	}
}
