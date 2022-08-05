import { editLocalized } from '@sapphire/plugin-i18next';

import { GuildStaffCommands } from './staff';

import type { Subcommand } from '@sapphire/plugin-subcommands';
import type { Parameters } from 'ts-toolbelt/out/Function/Parameters';

export abstract class GuildMemberCommands extends GuildStaffCommands {
	public async leaveRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, userGuild: guild, hunterinfo } = await this.init(interaction, true);

		if (await this.noGuild(interaction, locale, guild, 'user')) return;

		const role = this.getRole(guild as Parameters<typeof this.getRole>[0], interaction.user.id);

		if (role === 0) {
			await editLocalized(interaction, { keys: 'validation:guild.leave.master', formatOptions: { lng: locale } });
			return;
		}

		await this.container.db.collection('guild').updateOne(
			{ gid: guild?.gid },
			{
				$pull: {
					[`${role === 4 ? 'otherMembers' : 'members'}.${['m', 'v', 's', 'u', 'n'][role]}id${role ? '' : 's'}`]: interaction.user.id
				},
				$push: {
					logs: {
						$each: [
							{
								author: hunterinfo!.name,
								action: 'Guild Leave',
								message: 'validation:guild.log.leave',
								date: new Date(),
								options: {}
							}
						],
						$position: 0
					}
				}
			}
		);
		await this.container.db.collection('hunterinfo').updateOne({ uid: interaction.user.id }, { $set: { 'guilds.0.leftDate': new Date() } });

		await editLocalized(interaction, { keys: 'validation:guild.leave.success', formatOptions: { lng: locale } });
	}
}
