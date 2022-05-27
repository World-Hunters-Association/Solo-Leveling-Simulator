import type { SapphireClient } from '@sapphire/framework';
import { BaseCommandInteraction, Message, MessageComponentInteraction } from 'discord.js';

import { resolveKey } from '@sapphire/plugin-i18next';

import type { APIMessage } from 'discord.js/node_modules/discord-api-types/v10';

export default class Utils {
	public constructor(public client: SapphireClient) {}

	public HPMaxCalc(vit: number, level: number) {
		return Math.round(100 + level * 5 + vit * 3);
	}

	public MPMaxCalc(int: number, level: number) {
		return Math.round(100 + level * 5 + int * 0.5);
	}

	public async sendRetryMessage(target: Message): Promise<Message>;
	public async sendRetryMessage(target: BaseCommandInteraction | MessageComponentInteraction): Promise<APIMessage | Message>;
	public async sendRetryMessage(target: Message | BaseCommandInteraction | MessageComponentInteraction): Promise<APIMessage | Message> {
		const RandomRetryMessage = (await resolveKey(target, 'validation:retry', { returnObjects: true })) as string[];

		if (target instanceof Message) {
			return target.channel.send({ content: this.pickRandom(RandomRetryMessage) });
		}

		if (target.replied || target.deferred) return target.editReply({ content: this.pickRandom(RandomRetryMessage) });

		return target.reply({
			content: this.pickRandom(RandomRetryMessage),
			fetchReply: true
		});
	}

	public pickRandom<T>(array: readonly T[]): T {
		const { length } = array;
		return array[Math.floor(Math.random() * length)];
	}
}
