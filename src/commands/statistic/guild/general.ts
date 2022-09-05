import { editLocalized, resolveKey } from '@sapphire/plugin-i18next';

import { GuildMemberCommands } from './member';

import type { Subcommand } from '@sapphire/plugin-subcommands';
import type { Invite, Message, MessageEmbedOptions, TextChannel } from 'discord.js';

export abstract class GuildCommands extends GuildMemberCommands {
	public async infoRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, thisGuild, userGuild } = await this.init(interaction);

		if ((await this.noGuild(interaction, locale, userGuild, 'user')) || (await this.noGuild(interaction, locale, thisGuild, 'server'))) return;

		const guild = (userGuild || thisGuild)!;

		await interaction.editReply({ embeds: [await resolveKey(interaction, 'validation:guild.info', { lng: locale, gName: guild.name })] });
		// TODO: Level, XP, etc.
	}

	public async createRun(interaction: Subcommand.ChatInputInteraction<'cached'>) {
		const { locale, userGuild } = await this.init(interaction);

		if (!interaction.memberPermissions.has('ADMINISTRATOR')) {
			await editLocalized(interaction, { keys: 'validation:guild.create.admin', formatOptions: { lng: locale } });
			return;
		}

		if (interaction.guild.mfaLevel === 'NONE') {
			await editLocalized(interaction, { keys: 'validation:guild.create.mfa', formatOptions: { lng: locale } });
			return;
		}

		if (Boolean(userGuild)) {
			await editLocalized(interaction, { keys: 'validation:guild.create.alreadyHave', formatOptions: { lng: locale } });
			return;
		}

		const { exp } = (await this.container.db.collection('hunterstats').findOne({ uid: interaction.user.id }))!;
		const level = this.container.functions.HunterLevelCalc(exp);

		if (level < 10) {
			await editLocalized(interaction, { keys: 'validation:guild.create.level', formatOptions: { lng: locale } });
			return;
		}

		const { magicCore } = (await this.container.db.collection('money').findOne({ uid: interaction.user.id }))!;

		if (magicCore < 20) {
			await editLocalized(interaction, { keys: 'validation:guild.create.fee', formatOptions: { lng: locale } });
			return;
		}

		const name = interaction.options.getString(this.container.i18n.format('en-US', 'common:name').toLowerCase(), true);
		if (await this.container.db.collection('guilds').findOne({ name })) {
			await editLocalized(interaction, { keys: 'validation:guild.create.nameAlreadyExists', formatOptions: { lng: locale, name } });
			return;
		}

		const icon = interaction.options.getAttachment(this.container.i18n.format('en-US', 'common:icon').toLowerCase(), true);

		const invite = (await interaction.guild.invites
			.fetch(interaction.options.getString(this.container.functions.slashNameLocalizations('common:inviteCode')['en-US']!, true))
			.catch(async () =>
				Boolean(await editLocalized(interaction, { keys: 'validation:guild.create.inviteInvalid', formatOptions: { lng: locale } }))
			)) as Invite;
		if (
			!invite ||
			invite.guild?.id !== interaction.guildId ||
			Boolean(invite.expiresAt) ||
			Boolean(invite.maxUses) ||
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
			(invite as unknown as boolean) === true
		) {
			await editLocalized(interaction, { keys: 'validation:guild.create.inviteInvalid', formatOptions: { lng: locale } });
			return;
		}
		// ? Region

		await this.container.db.collection('money').updateOne({ uid: interaction.user.id }, { $inc: { magicCore: -20 } });
		const guild = {
			gid: interaction.guildId!,
			name,
			inviteURL: invite.url,
			iconURL: icon.url,
			shardId: interaction.guild!.shardId,
			createdDate: new Date(),
			requesting: true,
			members: { mid: interaction.user.id },
			otherMembers: {},
			level: { bonus: 0, members: 0, shopSlots: 0, vault: 0 },
			vault: { materials: {} as any, money: { gold: 0, magicCore: 0, manaCrystal: 0, token: 0 } },
			itemRequests: {},
			shop: [],
			logs: []
		};
		await this.container.db.collection('guild').insertOne(guild);

		const embed = JSON.stringify(
			await resolveKey(interaction, 'validation:guild.create.request', {
				lng: 'en-US',
				returnObjects: true,
				name,
				icon: icon.url,
				gid: guild.gid,
				mid: interaction.user.id,
				mName: (await this.container.db.collection('hunterinfo').findOne({ uid: interaction.user.id }))?.name
			})
		);

		await this.container.client.shard?.broadcastEval<Message, { embed: string; invite: string }>(
			async (client, context) =>
				(
					(await (
						await client.guilds.fetch(process.env.DB ? '724186681124716544' : '779360138623582260')
					).channels.fetch(process.env.DB ? '' : '998591314771857438')) as TextChannel
				).send({
					embeds: [JSON.parse(context.embed) as MessageEmbedOptions],
					// TODO: Accept and Decline buttons
					// TODO: Decline reason modal
					components: [{ type: 'ACTION_ROW', components: [{ type: 'BUTTON', style: 'LINK', url: context.invite, label: 'Join Guild' }] }]
				}),
			{
				shard:
					(await this.container.db.collection('guild').findOne({ gid: process.env.DB ? '724186681124716544' : '779360138623582260' }))!
						.shardId || 0,
				context: { embed, invite: invite.url }
			}
		);

		await editLocalized(interaction, { keys: 'validation:guild.create.success', formatOptions: { lng: locale } });
	}
}
