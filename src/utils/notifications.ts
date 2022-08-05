import { CommandInteraction, MessageEmbed, Snowflake } from 'discord.js';

import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { editLocalized, resolveKey, TOptions } from '@sapphire/plugin-i18next';

import { Utils } from '../lib/structures/Utils';

import type { PieceContext } from '@sapphire/framework';
import type { Filter } from 'mongodb';
import type { Notifications } from '../lib/structures/schemas';
import type { O } from 'ts-toolbelt';

export default class NotificationsUtils extends Utils {
	public constructor(context: PieceContext) {
		super(context);
	}

	public async notificate(interaction: CommandInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		const notification = await this.container.db.collection('notifications').findOne({ uids: interaction.user.id });

		if (!notification) return;

		await interaction.followUp({
			ephemeral: true,
			content: `<@${interaction.user.id}>`,
			embeds: notification.embed
				? [
						JSON.parse(
							await resolveKey(
								interaction,
								'constant:notification',
								Object.assign(notification.options || {}, {
									lng: locale,
									notification_message: JSON.stringify(notification.embed)
								})
							)
						)
				  ]
				: [
						{
							color: 'AQUA',
							description: (
								await resolveKey(
									interaction,
									'constant:notification',
									Object.assign(notification.options || {}, { lng: locale, notification_message: notification.message })
								)
							).toString(),
							title: (await resolveKey(interaction, 'common:notification', { lng: locale })).toUpperCase()
						}
				  ],
			allowedMentions: { users: [interaction.user.id] }
		});

		await this.delete({ _id: notification._id }, [interaction.user.id]);
	}

	public async delete(filter: Filter<Notifications>, uids: Snowflake[]) {
		const updated = (
			await this.container.db
				.collection('notifications')
				.findOneAndUpdate(filter, { $pull: { uids: { $in: uids } } }, { returnDocument: 'after' })
		).value;

		if (!updated?.uids.length) await this.container.db.collection('notifications').deleteOne(filter);
	}

	public async create(data: Notifications) {
		return this.container.db.collection('notifications').insertOne(data);
	}

	public async list(interaction: CommandInteraction) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		const notifications = await this.container.db.collection('notifications').find({ uids: interaction.user.id }).toArray();

		if (!notifications.length) {
			await editLocalized(interaction, { keys: 'common:none', formatOptions: { lng: locale } });
			return;
		}

		const message = new PaginatedMessage({
			template: new MessageEmbed()
				.setColor('DARK_GOLD')
				.setTitle((await resolveKey(interaction, 'common:notification', { lng: locale })).toUpperCase())
		});

		for (const notification of notifications) {
			if (notification.embed) message.addPage({ embeds: [notification.embed] });
			else message.addPageEmbed((embed) => embed.setDescription(notification.message || '-'));
		}

		message.setSelectMenuOptions((ind) => ({
			label: `${this.container.i18n.format(locale, 'common:page')} ${ind}`
		}));

		message.pageIndexPrefix = this.container.i18n.format(locale, 'common:page');

		message.addAction({
			type: 'BUTTON',
			label: (await resolveKey(interaction, 'common:delete', { lng: locale })).toUpperCase(),
			emoji: this.container.constants.EMOJIS.UI.CANCEL,
			customId: 'Delete',
			style: 'DANGER',
			run: async () => {
				await this.container.db
					.collection('notifications')
					.updateMany({ uids: interaction.user.id }, { $pull: { uids: interaction.user.id } });

				await this.container.db.collection('notifications').deleteMany({ uids: { $size: 0 } });
			}
		});

		await message.run(interaction);
	}

	public resolveKey<T extends TOptions>(key: string, options?: O.Has<T, 'lng', string> extends 1 ? 'DO NOT PASS lng FIELD' : T) {
		return `$t(${key}, ${JSON.stringify(options)})`;
	}
}

declare module '../lib/structures/UtilsStore' {
	interface UtilsStore {
		get(name: 'notifications'): NotificationsUtils;
	}
}
