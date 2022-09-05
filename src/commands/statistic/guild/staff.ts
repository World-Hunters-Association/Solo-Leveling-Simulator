import { MessageEmbed } from 'discord.js';

import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { editLocalized, resolveKey } from '@sapphire/plugin-i18next';

import { Constants } from '../../../utils/constants';
import { GuildMasterCommands } from './master';

import type { Subcommand } from '@sapphire/plugin-subcommands';
import type { Parameters } from 'ts-toolbelt/out/Function/Parameters';
export abstract class GuildStaffCommands extends GuildMasterCommands {
	public async joinRequestsRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, userGuild: guild } = await this.init(interaction);

		if (await this.notStaff(interaction, locale, guild)) return;

		const hunterinfos = await this.container.db
			.collection('hunterinfo')
			.find({ uid: { $all: guild?.otherMembers.pids } })
			.toArray();
		const hunterstats = await this.container.db
			.collection('hunterstats')
			.find({ uid: { $all: guild?.otherMembers.pids } })
			.toArray();

		const hunters = await Promise.all(
			hunterinfos
				.map((info, i) => ({
					uid: info.uid,
					name: info.name,
					rank: Constants.RANK[info.rankid],
					level: this.container.functions.HunterLevelCalc(hunterstats[i].exp)
				}))
				.map(async (hunter) => resolveKey(interaction, 'validation:guild.joinRequests.description', { lng: locale, ...hunter }))
		);

		const message = new PaginatedMessage({
			template: new MessageEmbed()
				.setColor('YELLOW')
				.setAuthor({ name: guild!.name })
				.setTitle(await resolveKey(interaction, 'validation:guild.joinRequests.title'))
		});

		const pageAmount = Math.ceil(hunters.length / 10);
		for (let i = 0; i < pageAmount; i++) {
			message.addAsyncPageEmbed(async (embed) =>
				embed.setDescription(
					`**${await resolveKey(interaction, 'common:page', {
						lng: locale,
						context: 'format',
						page: i + 1,
						total: pageAmount
					})}**\n${hunters
						.slice(i * 10, (i + 1) * 10)
						.map((l, ind) => `**${i * 10 + 1 + ind}.** ${l}`)
						.join('\n')}`
				)
			);
		}

		if (pageAmount === 0) message.addPageEmbed((embed) => embed.setDescription(this.container.i18n.format(locale, 'common:none')));

		message.setSelectMenuOptions((ind) => ({
			label: `${this.container.i18n.format(locale, 'common:page')} ${ind}`
		}));

		await message.run(interaction);
	}

	public async approveRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, userGuild: guild, hunterinfo } = await this.init(interaction, true);

		if (await this.notStaff(interaction, locale, guild)) return;

		const name = interaction.options.getString(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);
		const hunter = await this.notHunter(interaction, { name }, locale);

		if (hunter === true) return;
		if (!guild?.otherMembers.pids?.includes(hunter.uid)) return;

		await this.container.db
			.collection('hunterinfo')
			.updateOne({ uid: hunter.uid }, { $push: { guilds: { $each: [{ gid: guild!.gid, joinedDate: new Date() }], $position: 0 } } });
		await this.container.db.collection('guild').updateOne(
			{ gid: guild!.gid },
			{
				$push: {
					'otherMembers.nids': hunter.uid,
					logs: {
						$each: [
							{
								author: hunterinfo!.name,
								action: 'Member Approve',
								message: 'validation:guild.log.approve',
								date: new Date(),
								options: { target: name }
							}
						],
						$position: 0
					}
				}
			}
		);
		await this.container.db.collection('guild').updateMany({ 'otherMembers.pids': hunter.uid }, { $pull: { 'otherMembers.pids': hunter.uid } });
		await this.container.notifications.create({
			uids: [hunter.uid],
			message: this.container.notifications.resolveKey('validation:notifications.guild.joinRequestApproved', {
				gName: guild!.name
			})
		});
		await editLocalized(interaction, { keys: 'validation:guild.approve', formatOptions: { lng: locale, name, gName: guild.name } });
	}

	public async denyRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, userGuild: guild, hunterinfo } = await this.init(interaction, true);

		if (await this.notStaff(interaction, locale, guild)) return;

		const name = interaction.options.getString(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);
		const hunter = await this.notHunter(interaction, { name }, locale);

		if (hunter === true) return;
		if (!guild?.otherMembers.pids?.includes(hunter.uid)) return;

		await this.container.db.collection('guild').updateOne(
			{ gid: guild!.gid },
			{
				$pull: { 'otherMembers.pids': hunter.uid },
				$push: {
					logs: {
						$each: [
							{
								author: hunterinfo!.name,
								action: 'Member Deny',
								message: 'validation:guild.log.deny',
								date: new Date(),
								options: { target: name }
							}
						],
						$position: 0
					}
				}
			}
		);
		await this.container.notifications.create({
			uids: [hunter.uid],
			message: this.container.notifications.resolveKey('validation:notifications.guild.joinRequestDenied', {
				gName: guild!.name
			})
		});
		await editLocalized(interaction, { keys: 'validation:guild.deny', formatOptions: { lng: locale, name, gName: guild.name } });
	}

	public async kickRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, userGuild: guild, hunterinfo } = await this.init(interaction, true);

		if (await this.notStaff(interaction, locale, guild)) return;

		const name = interaction.options.getString(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);
		const hunter = await this.notHunter(interaction, { name }, locale);

		if (hunter === true) return;
		if (
			this.getRole(guild as Parameters<typeof this.getRole>[0], hunter.uid) <=
			this.getRole(guild as Parameters<typeof this.getRole>[0], interaction.user.id)
		) {
			await editLocalized(interaction, { keys: 'validation:guild.kick.cannot', formatOptions: { lng: locale, name } });
			return;
		}

		const reason = interaction.options.getString(this.container.i18n.format('en-US', 'common:reason').toLowerCase(), true);
		await this.container.db.collection('guild').updateOne(
			{ gid: guild!.gid },
			{
				$pull: { 'otherMembers.nids': hunter.uid, 'otherMembers.mids': hunter.uid },
				$push: {
					logs: {
						$each: [
							{
								author: hunterinfo!.name,
								action: 'Member Kick',
								message: 'validation:guild.log.kick',
								date: new Date(),
								options: { reason }
							}
						],
						$position: 0
					}
				}
			}
		);
		await this.container.notifications.create({
			uids: [hunter.uid],
			message: this.container.notifications.resolveKey('validation:notifications.guild.kick', {
				gName: guild!.name,
				reason
			})
		});
		await editLocalized(interaction, { keys: 'validation:guild.kick.success', formatOptions: { lng: locale, name, gName: guild?.name } });
	}

	public async newcomersPromoteRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, userGuild: guild, hunterinfo } = await this.init(interaction, true);

		if (await this.notStaff(interaction, locale, guild)) return;

		const name = interaction.options.getString(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);
		const hunter = await this.notHunter(interaction, { name }, locale);

		if (hunter === true) return;
		if (this.getRole(guild as Parameters<typeof this.getRole>[0], hunter.uid) !== 4) {
			await editLocalized(interaction, { keys: 'validation:guild.newcomersPromote.notNewcomer', formatOptions: { lng: locale, name } });
			return;
		}

		await this.container.db.collection('guild').updateOne(
			{ gid: guild!.gid },
			{
				$pull: { 'otherMembers.nids': hunter.uid },
				$push: {
					'members.uids': hunter.uid,
					logs: {
						$each: [
							{
								author: hunterinfo!.name,
								action: 'Newcomer Promote',
								message: 'validation:guild.log.newcomersPromote',
								date: new Date(),
								options: { target: hunter.name }
							}
						],
						$position: 0
					}
				}
			}
		);
		await this.container.notifications.create({
			uids: [hunter.uid],
			message: this.container.notifications.resolveKey('validation:notifications.guild.newcomersPromote', {
				gName: guild!.name
			})
		});
		await editLocalized(interaction, { keys: 'validation:guild.newcomersPromote.success', formatOptions: { lng: locale, name } });
	}

	public async logsRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, userGuild: guild } = await this.init(interaction);

		if (await this.notStaff(interaction, locale, guild)) return;

		const logs = guild?.logs;
		if (!logs) {
			await editLocalized(interaction, { keys: 'validation:guild.logs.none', formatOptions: { lng: locale } });
			return;
		}

		const messages = await Promise.all(
			logs.map(async (log) => ({
				author: { name: log.author },
				title: log.action,
				description: await resolveKey(
					interaction,
					'validation:guild.logs.message',
					Object.assign({ logs_messages: `$t(${log.message})`, lng: locale }, log.options)
				),
				timestamp: log.date
			}))
		);

		const pages = Math.ceil(messages.length / 10);
		const message = new PaginatedMessage({
			template: new MessageEmbed()
				.setTitle(await resolveKey(interaction, 'validation:guild.logs.title', { lng: locale }))
				.setColor('DARK_ORANGE')
				.setThumbnail(guild?.iconURL)
		});

		for (let i = 0; i < pages; i++) {
			message.addPageEmbed((embed) =>
				embed.setDescription(
					messages
						.splice(i * 10, 10)
						.map(
							(message, ind) =>
								`${ind + i * 10 + 1}. <t:${Math.round(message.timestamp.getTime() / 1000)}:R> - **${
									message.author?.name
								}**: ${this.container.i18n.format(locale, `glossary:guildLogsActions.${message.title}`)} - ${message.description}`
						)
						.join('\n')
				)
			);
		}

		message.pageIndexPrefix = await resolveKey(interaction, 'common:page', { lng: locale });

		await message.run(interaction);
	}
}
