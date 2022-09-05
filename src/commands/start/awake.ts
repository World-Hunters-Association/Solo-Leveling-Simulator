import type { CommandInteraction } from 'discord.js';

import { SlashCommandBuilder, SlashCommandStringOption } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';
import { editLocalized } from '@sapphire/plugin-i18next';

@ApplyOptions<CommandOptions>({
	name: 'awake',
	description: 'Hunter register',
	preconditions: ['EphemeralDefer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class UserCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder().addStringOption(new SlashCommandStringOption().setRequired(true));

		this.container.functions.setNameAndDescriptions(
			builder,
			['common:awake', 'validation:help.desccriptions.commands.AWAKE'],
			['common:name', 'common:descriptions.awakeName']
		);

		registry.registerChatInputCommand(builder, {
			idHints: ['964148503146291200'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const { db } = this.container;
		const hunter = await db.collection('hunterinfo').countDocuments({ uid: interaction.user.id });

		if (hunter) {
			await editLocalized(interaction, { keys: 'validation:awake.awaken' });
			return;
		}

		const name = interaction.options.getString('name', true);

		if (await this.container.db.collection('hunterinfo').findOne({ name })) {
			await editLocalized(interaction, { keys: 'validation:awake.nameExists' });
			return;
		}

		await Promise.all([
			db.collection('hunterinfo').insertOne({
				uid: interaction.user.id,
				guilds: [],
				classid: 6,
				rankid: 1,
				titleid: 1,
				name
			}),
			db.collection('hunterstats').insertOne({
				uid: interaction.user.id,
				exp: 0,
				hp: 450,
				mp: 90,
				int: 16,
				str: 16,
				mr: 16,
				def: 16,
				sp: 36,
				luk: 32,
				agi: 32
			}),
			db.collection('money').insertOne({ uid: interaction.user.id, manaCrystal: 0, magicCore: 0, gold: 550, votePoint: 0 }),
			db.collection('keys').insertOne({
				uid: interaction.user.id,
				keys: {
					'E-rank key': 10,
					'D-rank key': 0,
					'C-rank key': 0,
					'B-rank key': 0,
					'A-rank key': 0,
					'S-rank key': 0,
					'SS-rank key': 0,
					'Uprank key': 0
				}
			}),
			db.collection('potions').insertOne({ uid: interaction.user.id, potions: { 'Life Potion I': 0, 'Mana Potion I': 0 } }),
			db.collection('penalty').insertOne({ uid: interaction.user.id, quest: 0, warn: 0, captcha: 100 }),
			db.collection('stone').insertOne({ uid: interaction.user.id, stones: { 'Thunder Stone': 1 } }),
			db.collection('recover').insertOne({ uid: interaction.user.id, has: true }),
			db.collection('cooldowns').insertOne({ uid: interaction.user.id, commands: { daily: 0, gate: 0, weekly: 0 }, skills: {} }),
			db.collection('daily').insertOne({ uid: interaction.user.id, streak: 0 }),
			db.collection('lottery').insertOne({ uid: interaction.user.id, amount: 0 }),
			db.collection('equipment').insertOne({ uid: interaction.user.id, equipped: {}, unequipped: {} }),
			db
				.collection('boxes')
				.insertOne({ uid: interaction.user.id, boxes: { 'Random Box': 0, 'Random Cursed Box': 0, 'Random Blessed Box': 0 } }),
			db.collection('material').insertOne({ uid: interaction.user.id, materials: {} as any }),
			db.collection('hunter_skills').insertOne({ uid: interaction.user.id, skills: { Punch: 0 } }),
			db.collection('config').insertOne({ uid: interaction.user.id, stats: false, logs: false, ping: true }),
			db.collection('challenges').insertOne({ uid: interaction.user.id, challenges: {} }),
			db.collection('gems').insertOne({ uid: interaction.user.id, gems: {} }),
			db.collection('language').insertOne({ uid: interaction.user.id, language: 'en-US' })
		]);

		await this.container.applicationCommandRegistries.acquire('start').command?.chatInputRun!(interaction, {
			commandName: 'start',
			commandId: '964148504962404462'
		});
	}
}

declare module '@sapphire/framework' {
	interface CommandStore {
		get(name: 'awake'): UserCommand;
	}
}
