import { ContextMenuInteraction, Message, MessageActionRow, MessageButton } from 'discord.js';

import { ContextMenuCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Args, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { editLocalized, sendLocalized } from '@sapphire/plugin-i18next';

import { EMOJIS } from '../../lib/constants';

@ApplyOptions<CommandOptions>({
	name: 'reset',
	description: 'Delete the hunter progress',
	preconditions: ['Defer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class ResetHunterCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerContextMenuCommand(new ContextMenuCommandBuilder().setName(this.name).setType(2).setDefaultPermission(false), {
			idHints: ['966351012740862053'],
			guildIds: ['779360138623582260'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async contextMenuRun(interaction: ContextMenuInteraction) {
		await this.reset({ interaction });
	}

	public async messageRun(message: Message, args: Args) {
		await this.reset({ message }, args);
	}

	private async reset({ interaction, message }: { interaction?: ContextMenuInteraction; message?: Message }, args?: Args) {
		const locale = (await this.container.i18n.fetchLanguage(interaction! || message!)) || 'en-US';
		let components = [
			new MessageActionRow().setComponents([
				new MessageButton()
					.setCustomId(`Yes`)
					.setLabel(this.container.i18n.getT(locale)('common:yes'))
					.setStyle('SECONDARY')
					.setEmoji(EMOJIS.UI.YES),
				new MessageButton()
					.setCustomId(`No`)
					.setLabel(this.container.i18n.getT(locale)('common:no'))
					.setStyle('PRIMARY')
					.setEmoji(EMOJIS.UI.CANCEL)
			])
		];

		const targetId = interaction?.targetId || (await args?.pick('user'))?.id;

		const { language } = (await this.container.db.collection('language').findOne({ uid: targetId })) ?? { language: 'en-US' };

		const msg = Boolean(interaction)
			? await editLocalized(interaction!, {
					keys: 'validation:reset.warning',
					formatOptions: { mention: `<@${targetId}>`, lng: language },
					components,
					fetchReply: true
			  })
			: // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
			  await sendLocalized(message?.channel!, {
					keys: 'validation:reset.warning',
					formatOptions: { mention: `<@${targetId}>`, lng: language },
					components
			  });

		components = components.map((row) => {
			row.components = row.components.map((button) => button.setDisabled(true));
			return row;
		});

		const collector = (msg as Message).createMessageComponentCollector({
			filter: (i) => i.user.id === targetId,
			time: 30000,
			max: 1
		});

		collector.on('collect', async (i) => {
			await i.deferUpdate();
			switch (i.customId) {
				case 'Yes':
					await editLocalized(i, { keys: 'validation:reset.processing', components, formatOptions: { lng: language } });
					await Promise.all([
						this.container.db.collection('hunterinfo').deleteOne({ uid: targetId }),
						this.container.db.collection('hunterstats').deleteOne({ uid: targetId }),
						this.container.db.collection('money').deleteOne({ uid: targetId }),
						this.container.db.collection('keys').deleteOne({ uid: targetId }),
						this.container.db.collection('potions').deleteOne({ uid: targetId }),
						this.container.db.collection('penalty').deleteOne({ uid: targetId }),
						this.container.db.collection('stone').deleteOne({ uid: targetId }),
						this.container.db.collection('recover').deleteOne({ uid: targetId }),
						this.container.db.collection('cooldowns').deleteOne({ uid: targetId }),
						this.container.db.collection('daily').deleteOne({ uid: targetId }),
						this.container.db.collection('referral').deleteOne({ uid: targetId }),
						this.container.db.collection('lottery').deleteOne({ uid: targetId }),
						this.container.db.collection('equipment').deleteOne({ uid: targetId }),
						this.container.db.collection('boxes').deleteOne({ uid: targetId }),
						this.container.db.collection('material').deleteOne({ uid: targetId }),
						this.container.db.collection('hunter_skills').deleteOne({ uid: targetId }),
						this.container.db.collection('config').deleteOne({ uid: targetId }),
						this.container.db.collection('achievements').deleteOne({ uid: targetId }),
						this.container.db.collection('gems').deleteOne({ uid: targetId }),
						this.container.db.collection('language').deleteOne({ uid: targetId })
					]).then(async (changes) => {
						if (changes.every((change) => Boolean(change.deletedCount)))
							await editLocalized(i, {
								keys: 'validation:reset.success',
								formatOptions: { mention: `<@${targetId}>`, lng: language }
							});
						else await editLocalized(i, { keys: 'validation:reset.error', formatOptions: { lng: language } });
					});
					break;
				case 'No':
					await editLocalized(i, { keys: 'validation:reset.decline', components, formatOptions: { lng: language } });
			}
		});

		collector.on('end', async (_collected, reason) => {
			if (reason === 'time')
				await editLocalized(interaction! || msg!, { keys: 'validation:reset.timeout', components, formatOptions: { lng: language } });
		});
	}
}
