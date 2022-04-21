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
export default class AwakeCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		const builder = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description)
			.addStringOption(
				new SlashCommandStringOption().setName('name').setRequired(true).setDescription('Your Solo Leveling Simulator World Name')
			);
		registry.registerChatInputCommand(builder, {
			idHints: ['964148503146291200'],
			behaviorWhenNotIdentical: RegisterBehavior.Overwrite
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		const { db } = this.container;
		const { utils } = this.container;
		const hunter = await db.collection('hunterinfo').countDocuments({ uid: interaction.user.id });

		if (hunter) {
			await editLocalized(interaction, { keys: 'validation:awake.awaken' });
			return;
		}

		await Promise.all([
			db.collection('hunterinfo').insertOne({
				uid: interaction.user.id,
				gid: undefined,
				classid: 6,
				rankid: 1,
				titleid: 1,
				name: interaction.options.getString('name', true)
			}),
			db.collection('hunterstats').insertOne({
				uid: interaction.user.id,
				exp: 0,
				hp: utils.HPMaxCalc(10, 1),
				mp: utils.MPMaxCalc(10, 1),
				int: 10,
				str: 10,
				mr: 10,
				def: 10,
				sp: 36,
				vit: 10,
				agi: 10
			}),
			db.collection('money').insertOne({ uid: interaction.user.id, manacrystal: 0, magiccore: 0, golds: 550 }),
			db.collection('keys').insertOne({ uid: interaction.user.id, e: 10, d: 3, c: 0, b: 0, a: 0, s: 0, ss: 0, uprank: 0 }),
			db.collection('potions').insertOne({ uid: interaction.user.id, life: 0, mana: 0 }),
			db.collection('penalty').insertOne({ uid: interaction.user.id, quest: 0, warn: 0, captcha: 100 }),
			db.collection('stone').insertOne({ uid: interaction.user.id, thunder: 1 }),
			db.collection('recover').insertOne({ uid: interaction.user.id, has: true }),
			db.collection('cooldowns').insertOne({ uid: interaction.user.id, gate: 0, skills: {} }),
			db.collection('daily').insertOne({ uid: interaction.user.id, streak: 0 }),
			db.collection('referral').insertOne({ uid: interaction.user.id, give: 0, receive: 0, codes: [] }),
			db.collection('lottery').insertOne({ uid: interaction.user.id, amount: 0 }),
			db.collection('equipment').insertOne({ uid: interaction.user.id, equipped: {}, unequipped: {} }),
			db.collection('boxes').insertOne({ uid: interaction.user.id }),
			db.collection('material').insertOne({ uid: interaction.user.id, materials: {} }),
			db.collection('hunter_skills').insertOne({ uid: interaction.user.id, skills: { Punch: 0 } }),
			db.collection('config').insertOne({ uid: interaction.user.id, stats: false, logs: false, ping: true }),
			db.collection('achievements').insertOne({ uid: interaction.user.id, achievements: {} }),
			db.collection('gems').insertOne({ uid: interaction.user.id, gems: {} }),
			db.collection('language').insertOne({ uid: interaction.user.id, language: 'en-US' })
		]);

		await this.container.applicationCommandRegistries.acquire('start').command?.chatInputRun!(interaction, {
			commandName: 'start',
			commandId: '964148504962404462'
		});
	}
}
