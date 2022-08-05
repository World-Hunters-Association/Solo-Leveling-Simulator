import { SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, RegisterBehavior } from '@sapphire/framework';

import { GuildCommands } from './general';

import type { SubcommandMappingArray, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { ApplicationCommandOptionType } from 'discord-api-types/v9';

@ApplyOptions<SubcommandOptions>({
	name: 'guild',
	preconditions: ['Defer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends GuildCommands {
	public readonly subcommandMappings: SubcommandMappingArray = [
		{
			name: 'master',
			type: 'group',
			entries: [
				{
					name: 'upgrade',
					chatInputRun: 'upgradeRun'
				},
				{
					name: 'promote',
					chatInputRun: 'memberPromoteRun'
				},
				{
					name: 'demote',
					chatInputRun: 'demoteRun'
				},
				{
					name: 'transfer',
					chatInputRun: 'transferRun'
				},
				{
					name: 'set-requirement',
					chatInputRun: 'requirementRun'
				}
			]
		},
		{
			name: 'staff',
			type: 'group',
			entries: [
				{
					name: 'join-requests',
					chatInputRun: 'joinRequestsRun'
				},
				{
					name: 'approve',
					chatInputRun: 'approveRun'
				},
				{
					name: 'deny',
					chatInputRun: 'denyRun'
				},
				{
					name: 'kick',
					chatInputRun: 'kickRun'
				},
				{
					name: 'promote',
					chatInputRun: 'newcomersPromoteRun'
				},
				{
					name: 'logs',
					chatInputRun: 'logsRun'
				}
			]
		},
		{
			name: 'member',
			type: 'group',
			entries: [
				{
					name: 'leave',
					chatInputRun: 'leaveRun'
				},
				{
					name: 'shop',
					chatInputRun: 'shopRun'
				},
				{
					name: 'donate',
					chatInputRun: 'donateRun'
				}
			]
		},
		{
			name: 'quest',
			type: 'group',
			entries: [
				{
					name: 'list',
					chatInputRun: 'questListRun'
				},
				{
					name: 'accept',
					chatInputRun: 'questAcceptRun'
				},
				{
					name: 'complete',
					chatInputRun: 'questCompleteRun'
				},
				{
					name: 'give-up',
					chatInputRun: 'questGiveUpRun'
				}
			]
		},
		{
			name: 'info',
			chatInputRun: 'infoRun'
		},
		{
			name: 'create',
			chatInputRun: 'createRun'
		}
	];

	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder().setDefaultMemberPermissions(8);

		this.container.functions.setNameAndDescriptions(builder, [
			'common:guild',
			'validation:help.desccriptions.commands.GUILD',
			[
				[
					'common:master',
					'common:descriptions.guildMaster',
					[
						[
							'common:upgrade',
							'common:descriptions.guildUpgrade',
							[
								[
									'common:type',
									'common:descriptions.guildUpgradeType',
									['common:guildMemberCapacity', 'common:guildVaultSize', 'common:guildShopSlots', 'common:guildBoost'],
									{ type: ApplicationCommandOptionType['String'], required: true },
									'String'
								]
							]
						],
						[
							'common:promote',
							'common:descriptions.guildPromote',
							[
								[
									'common:hunter',
									'common:descriptions.guildPromoteHunter',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true, autocomplete: true },
									'String'
								],
								[
									'common:role',
									'common:descriptions.guildPromoteRole',
									undefined,
									{
										type: ApplicationCommandOptionType['Number'],
										required: true,
										choices: [
											{ name: 'common:staff', value: 2 },
											{ name: 'common:viceMaster', value: 1 }
										]
									},
									'Number'
								]
							]
						],
						[
							'common:demote',
							'common:descriptions.guildDemote',
							[
								[
									'common:hunter',
									'common:descriptions.guildDemoteHunter',
									undefined,
									{ type: ApplicationCommandOptionType['User'], required: true },
									'User'
								],
								[
									'common:role',
									'common:descriptions.guildDemoteRole',
									undefined,
									{
										type: ApplicationCommandOptionType['Number'],
										required: true,
										choices: [
											{ name: 'common:staff', value: 2 },
											{ name: 'common:member', value: 3 }
										]
									},
									'Number'
								]
							]
						],
						[
							'common:transfer',
							'common:descriptions.guildTransfer',
							[
								[
									'common:hunter',
									'common:descriptions.guildTransferHunter',
									undefined,
									{ type: ApplicationCommandOptionType['User'], required: true },
									'User'
								]
							]
						],
						[
							'common:setRequirement',
							'common:descriptions.guildSetRequirement',
							[
								[
									'common:type',
									'common:descriptions.guildRequirementType',
									['common:level', 'common:rank'],
									{ type: ApplicationCommandOptionType['String'], required: true },
									'String'
								],
								[
									'common:value',
									'common:descriptions.guildRequirementValue',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true, autocomplete: true },
									'String'
								]
							]
						]
					]
				],
				[
					'common:staff',
					'common:descriptions.guildStaff',
					[
						['common:join-requests', 'common:descriptions.guildJoinRequests'],
						[
							'common:approve',
							'common:descriptions.guildApprove',
							[
								[
									'common:hunter',
									'common:descriptions.guildApproveHunter',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true, autocomplete: true },
									'String'
								]
							]
						],
						[
							'common:deny',
							'common:descriptions.guildDeny',
							[
								[
									'common:hunter',
									'common:descriptions.guildDenyHunter',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true, autocomplete: true },
									'String'
								]
							]
						],
						[
							'common:kick',
							'common:descriptions.guildKick',
							[
								[
									'common:hunter',
									'common:descriptions.guildHunter',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true, autocomplete: true },
									'String'
								],
								[
									'common:reason',
									'common:descriptions.guildKickReason',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true },
									'String'
								]
							]
						],
						[
							'common:promote',
							'common:descriptions.guildNewcomerPromote',
							[
								[
									'common:hunter',
									'common:descriptions.guildNewcomerPromoteHunter',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true, autocomplete: true },
									'String'
								]
							]
						],
						['common:logs', 'common:descriptions.guildLogs']
					]
				],
				[
					'common:member',
					'common:descriptions.guildMember',
					[
						['common:leave', 'common:descriptions.guildLeave'],
						['common:shop', 'common:descriptions.guildShop'],
						[
							'common:donate',
							'common:descriptions.guildDonate',
							[
								[
									'common:type',
									'common:descriptions.guildDonateType',
									['common:material', 'common:equipment'],
									{ type: ApplicationCommandOptionType['String'], required: true },
									'String'
								],
								[
									'common:quantity',
									'common:descriptions.guildDonateQuantity',
									undefined,
									{ type: ApplicationCommandOptionType['Number'] },
									'Number'
								]
							]
						]
					]
				],
				[
					'common:quest',
					'common:descriptions.guildQuest',
					[
						['common:list', 'common:descriptions.guildQuestList'],
						[
							'common:take',
							'common:descriptions.guildQuestTake',
							[
								[
									'common:quest',
									'common:descriptions.guildQuestTakeQuest',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true, autocomplete: true },
									'String'
								]
							]
						],
						['common:complete', 'common:descriptions.guildQuestComplete'],
						['common:giveUp', 'common:descriptions.guildQuestGiveUp']
					]
				],
				[
					undefined,
					undefined,
					[
						['common:info', 'common:descriptions.guildInfo'],
						[
							'common:create',
							'common:descriptions.guildCreate',
							[
								[
									'common:name',
									'common:descriptions.guildCreateName',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true },
									'String'
								],
								[
									'common:icon',
									'common:descriptions.guildCreateIcon',
									undefined,
									{ type: ApplicationCommandOptionType['Attachment'], required: true },
									'Attachment'
								],
								[
									'common:inviteCode',
									'common:descriptions.guildCreateInviteCode',
									undefined,
									{ type: ApplicationCommandOptionType['String'], required: true },
									'String'
								]
							]
						]
					]
				]
			]
		]);

		registry.registerChatInputCommand(builder, {
			idHints: ['998595826425278586'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'guild'): UserCommand;
	}
}
