import './lib/setup';

import { Collection, GuildEmoji, LimitedCollection, Message } from 'discord.js';
import { Db, MongoClient } from 'mongodb';
import { join } from 'path';

import { Awaitable, BucketScope, SapphireClient } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { DurationFormatter } from '@sapphire/time-utilities';

import { UtilsStore } from './lib/structures/UtilsStore';

import type { InternationalizationContext } from '@sapphire/plugin-i18next';
import type { AlpetaOptions } from './lib/setup';
export default class System extends SapphireClient {
	public config: AlpetaOptions;

	public constructor(config: AlpetaOptions, { $db, db }: { $db: Db; db: Db }) {
		super({
			allowedMentions: { parse: ['users'], repliedUser: true },
			intents: [
				'GUILDS',
				'GUILD_MEMBERS',
				'GUILD_BANS',
				'GUILD_EMOJIS_AND_STICKERS',
				'GUILD_VOICE_STATES',
				'GUILD_MESSAGES',
				'GUILD_MESSAGE_REACTIONS',
				'DIRECT_MESSAGES',
				'DIRECT_MESSAGE_REACTIONS',
				'GUILD_INVITES'
			],
			loadMessageCommandListeners: true,
			defaultPrefix: 'sl ',
			makeCache: (manager) => {
				if (['GuildEmojiManager', 'BaseGuildEmojiManager'].includes(manager.name))
					return new LimitedCollection({
						maxSize: 10000,
						sweepInterval: 30,
						sweepFilter: () => (emoji: GuildEmoji) => !config.owner?.includes(emoji.guild.ownerId)
					});
				if (['MessageManager'].includes(manager.name))
					return new LimitedCollection({
						maxSize: 50,
						sweepInterval: 60,
						sweepFilter: () => (message: Message) =>
							message.author.id !== this.user?.id && message.createdTimestamp > Date.now() - 2 * 60 * 60 * 1000,
						keepOverLimit: (message) => message.author.id === this.user?.id
					});
				if (
					![
						'GuildManager',
						'ChannelManager',
						'GuildChannelManager',
						'RoleManager',
						'PermissionOverwriteManager',
						'GuildEmojiManager'
					].includes(manager.name)
				)
					return new LimitedCollection({
						maxSize: 50,
						sweepInterval: 30
					});
				return new Collection();
			},
			defaultCooldown: {
				delay: 500,
				filteredCommands: [''],
				scope: BucketScope.Channel
			},
			i18n: {
				fetchLanguage: async (context: InternationalizationContext) => {
					const userSettings = await db.collection('language').findOne({ uid: context.user?.id });
					return container.constants.SUPPORTED_LANGUAGES.includes(userSettings!.language) ? userSettings?.language || 'en-US' : 'en-US';
				},
				defaultLanguageDirectory: join(__dirname, 'languages'),
				hmr: {
					enabled: true
				},
				formatters: [
					{
						name: 'lowercase',
						format: (value: string) => value.toLowerCase()
					},
					{
						name: 'duration',
						format: (value: number, lng: string) => new DurationFormatter(container.functions.timeUnitsLocalizations(lng)).format(value)
					},
					{
						name: 'eqStats',
						format: (value: number) => (value >= 0 ? `+` : `-`) + Intl.NumberFormat().format(value)
					}
				]
			},
			botList: {
				clientId: '703043558483034223',
				shard: true,
				keys: {
					topGG: process.env.DBL_TOKEN
				}
			},
			statcord: {
				key: process.env.STATCORD_KEY!,
				autopost: true,
				sharding: true
			}
		});

		this.config = config;

		this.stores.register(new UtilsStore().registerPath(join(__dirname, 'utils')));

		container.db = db;
		container.$db = $db;

		container.i18n.fetchLanguageWithDefault = container.i18n.fetchLanguage as (context: InternationalizationContext) => Awaitable<string>;

		// process.on('unhandledRejection', () => ({}));
	}
}

void new MongoClient(process.env.MONGO_URL!).connect().then(async (mClient) => {
	const client = new System(
		{
			owner: JSON.parse(process.env.OWNER!),
			token: process.env.TOKEN!,
			root: '.'
		},
		{
			db: mClient.db(process.env.DB || 'leveling-solo-simulator'),
			$db: mClient.db(process.env.DB === 'solo-leveling-simulator' ? 'leveling-solo-simulator' : 'solo-leveling-simulator')
		}
	);
	await client.login(client.config.token);
});
