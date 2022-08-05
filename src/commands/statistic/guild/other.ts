import { editLocalized } from '@sapphire/plugin-i18next';
import { Subcommand } from '@sapphire/plugin-subcommands';

import type { ModalSubmitInteraction, Snowflake } from 'discord.js';

import type { Guild } from '../../../lib/structures/schemas';

export abstract class GuildCommands extends Subcommand {
	public async init(interaction: Subcommand.ChatInputInteraction<'cached'> | ModalSubmitInteraction, hunterinfo = false) {
		const locale = await this.container.i18n.fetchLanguageWithDefault(interaction);
		const userGuild = (await this.container.db.collection('guild').findOne({
			$or: [
				{ 'members.mid': interaction.user.id },
				{ 'members.vids': interaction.user.id },
				{ 'members.sids': interaction.user.id },
				{ 'members.uids': interaction.user.id }
			]
		})) as Guild | null;
		const thisGuild =
			userGuild?.gid === interaction.guildId
				? userGuild
				: ((await this.container.db.collection('guild').findOne({ gid: interaction.guildId || '' })) as Guild | null);
		return {
			locale,
			thisGuild,
			userGuild,
			hunterinfo: hunterinfo ? (await this.container.db.collection('hunterinfo').findOne({ uid: interaction.user.id }))! : undefined
		};
	}

	public async noGuild(interaction: Subcommand.ChatInputInteraction<'cached'>, locale: string, guild: Guild | null, type: 'user' | 'server') {
		if (!guild) {
			await editLocalized(interaction, { keys: `validation:guild.noGuild_${type}`, formatOptions: { lng: locale } });
			return true;
		}
		return false;
	}

	public async notMaster(interaction: Subcommand.ChatInputInteraction<'cached'>, locale: string, guild: Guild | null, reply = true) {
		if (guild?.members.mid !== interaction.user.id) {
			if (reply) await editLocalized(interaction, { keys: 'validation:guild.notMaster', formatOptions: { lng: locale } });
			return true;
		}
		return false;
	}

	public async notViceMaster(interaction: Subcommand.ChatInputInteraction<'cached'>, locale: string, guild: Guild | null, reply = true) {
		if (await this.notMaster(interaction, locale, guild, false))
			if (!guild?.members.vids?.includes(interaction.user.id)) {
				if (reply) await editLocalized(interaction, { keys: 'validation:guild.notViceMaster', formatOptions: { lng: locale } });
				return true;
			}
		return false;
	}

	public async notStaff(interaction: Subcommand.ChatInputInteraction<'cached'>, locale: string, guild: Guild | null, reply = true) {
		if (await this.notViceMaster(interaction, locale, guild, false))
			if (!guild?.members.sids?.includes(interaction.user.id)) {
				if (reply) await editLocalized(interaction, { keys: 'validation:guild.notStaff', formatOptions: { lng: locale } });
				return true;
			}
		return false;
	}

	public async notHunter(
		interaction: Subcommand.ChatInputInteraction<'cached'>,
		{ uid, name }: { uid?: Snowflake; name?: string },
		locale: string
	) {
		const hunter = await this.container.db.collection('hunterinfo').findOne({ $or: [{ uid }, { name }] });

		if (!hunter) {
			await editLocalized(interaction, {
				keys: 'validation:mentionNotHunter',
				formatOptions: { mention: name || uid, lng: locale }
			});
			return true;
		}
		return hunter;
	}

	/**
	 * @returns
	 * 0 aka Master |
	 * 1 aka Vice Master |
	 * 2 aka Staff |
	 * 3 aka Member |
	 * 4 aka Newcomer |
	 * 5 aka None
	 */
	public getRole(guild: Guild, uid: Snowflake) {
		const { members, otherMembers } = guild;
		return members.mid === uid
			? 0 // ? 'Master'
			: members.vids?.includes(uid)
			? 1 // ? 'Vice Master'
			: members.sids?.includes(uid)
			? 2 // ? 'Staff'
			: members?.uids?.includes(uid)
			? 3 // ? 'Member'
			: otherMembers?.nids?.includes(uid)
			? 4 // ? 'Newcomer'
			: 5; // ? 'None'
	}

	public async lockedCommands(interaction: Subcommand.ChatInputInteraction<'cached'>, locale: string) {
		const { exp } = (await this.container.db.collection('hunterstats').findOne({ uid: interaction.user.id }))!;
		const level = this.container.functions.HunterLevelCalc(exp);
		if (level < 5) {
			await editLocalized(interaction, { keys: 'validation:guild.lockedCommands', formatOptions: { lng: locale } });
			return true;
		}
		return false;
	}

	public getGuildMembers(guild: Guild, includesNewcomers = true) {
		return Object.entries(guild!.members)
			.reduce<string[]>((acc, [, member]) => acc.concat(member), [])
			.concat(includesNewcomers ? guild!.otherMembers.nids || [] : []);
	}
}
