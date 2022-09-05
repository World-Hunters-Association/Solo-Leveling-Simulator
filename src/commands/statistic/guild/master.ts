import { editLocalized } from '@sapphire/plugin-i18next';

import { GuildCommands } from './other';

import type { Subcommand } from '@sapphire/plugin-subcommands';
export abstract class GuildMasterCommands extends GuildCommands {
	public async memberPromoteRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, userGuild: guild, hunterinfo } = await this.init(interaction, true);

		if (await this.notViceMaster(interaction, locale, guild)) return;

		const name = interaction.options.getString(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);
		const hunter = await this.notHunter(interaction, { name }, locale);

		if (hunter === true) return;

		const hunterRole = this.getRole(guild!, hunter.uid);
		const userRole = this.getRole(guild!, hunterinfo!.uid);
		const targetRole = interaction.options.getNumber(this.container.i18n.format('en-US', 'common:role').toLowerCase(), true);

		if (hunterRole !== 2 && hunterRole !== 3) {
			await editLocalized(interaction, { keys: 'validation:guild.promote.invalidHunter', formatOptions: { lng: locale, name } });
			return;
		}

		if (hunterRole === targetRole || userRole === targetRole) {
			await editLocalized(interaction, { keys: 'validation:guild.promote.invalidRole', formatOptions: { lng: locale, name } });
			return;
		}

		await this.container.db.collection('guild').updateOne(
			{ gid: guild!.gid },
			{
				$pull: { [`members.${hunterRole === 2 ? 's' : 'u'}ids`]: hunter.uid },
				$push: {
					[`members.${targetRole === 2 ? 's' : 'v'}ids`]: hunter.uid,
					logs: {
						$each: [
							{
								author: hunterinfo!.name,
								action: 'Member Promote',
								message: 'validation:guild.log.promote',
								date: new Date(),
								options: { target: hunter.name, role: targetRole === 2 ? `$t(common:staff)` : '$t(common:viceMaster)' }
							}
						],
						$position: 0
					}
				}
			}
		);
		await this.container.notifications.create({
			uids: this.getGuildMembers(guild!),
			embed: {
				author: { name: guild?.name },
				color: 'AQUA',
				thumbnail: { url: guild?.iconURL },
				description: 'validation:notifications.guild.promote'
			},
			options: {
				name: hunter.name,
				role: targetRole === 2 ? `$t(common:staff)` : '$t(common:viceMaster)'
			}
		});
		await editLocalized(interaction, { keys: 'validation:guild.promote.success', formatOptions: { lng: locale, name } });
	}

	public async demoteRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, userGuild: guild, hunterinfo } = await this.init(interaction, true);

		if (await this.notViceMaster(interaction, locale, guild)) return;

		const name = interaction.options.getString(this.container.i18n.format('en-US', 'common:hunter').toLowerCase(), true);
		const hunter = await this.notHunter(interaction, { name }, locale);

		if (hunter === true) return;

		const hunterRole = this.getRole(guild!, hunter.uid);
		const userRole = this.getRole(guild!, hunterinfo!.uid);
		const targetRole = interaction.options.getNumber(this.container.i18n.format('en-US', 'common:role').toLowerCase(), true);

		if (hunterRole !== 2 && hunterRole !== 1) {
			await editLocalized(interaction, { keys: 'validation:guild.demote.invalidHunter', formatOptions: { lng: locale, name } });
			return;
		}

		if (hunterRole === targetRole || userRole === hunterRole) {
			await editLocalized(interaction, { keys: 'validation:guild.demote.invalidRole', formatOptions: { lng: locale, name } });
			return;
		}

		await this.container.db.collection('guild').updateOne(
			{ gid: guild!.gid },
			{
				$pull: { [`members.${hunterRole === 2 ? 's' : 'v'}ids`]: hunter.uid },
				$push: {
					[`members.${targetRole === 2 ? 's' : 'u'}ids`]: hunter.uid,
					logs: {
						$each: [
							{
								author: hunterinfo!.name,
								action: 'Member Demote',
								message: 'validation:guild.log.demote',
								date: new Date(),
								options: { target: hunter.name, role: targetRole === 2 ? `$t(common:staff)` : '$t(common:member)' }
							}
						],
						$position: 0
					}
				}
			}
		);
		await this.container.notifications.create({
			uids: this.getGuildMembers(guild!),
			embed: {
				author: { name: guild?.name },
				color: 'AQUA',
				thumbnail: { url: guild?.iconURL },
				description: 'validation:notifications.guild.demote'
			},
			options: {
				name: hunter.name,
				role: targetRole === 2 ? `$t(common:staff)` : '$t(common:member)'
			}
		});
		await editLocalized(interaction, { keys: 'validation:guild.demote.success', formatOptions: { lng: locale, name } });
	}
}
