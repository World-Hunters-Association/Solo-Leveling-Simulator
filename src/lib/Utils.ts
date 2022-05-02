import type { SapphireClient } from '@sapphire/framework';
import type { APIMessage } from 'discord-api-types';
import { BaseCommandInteraction, Message, MessageComponentInteraction, MessageEmbed } from 'discord.js';

import { RandomLoadingMessage } from './constants';

export default class Utils {
	public constructor(public client: SapphireClient) {}

	public HPMaxCalc(vit: number, level: number) {
		return Math.round(100 + level * 5 + vit * 3);
	}

	public MPMaxCalc(int: number, level: number) {
		return Math.round(100 + level * 5 + int * 0.5);
	}

	public sendLoadingMessage(target: Message): Promise<Message>;
	public sendLoadingMessage(target: BaseCommandInteraction | MessageComponentInteraction): Promise<APIMessage | Message>;
	public sendLoadingMessage(target: Message | BaseCommandInteraction | MessageComponentInteraction): Promise<APIMessage | Message> {
		if (target instanceof Message) {
			return target.channel.send({ embeds: [new MessageEmbed().setDescription(this.pickRandom(RandomLoadingMessage)).setColor('#FF0000')] });
		}

		return target.editReply({ embeds: [new MessageEmbed().setDescription(this.pickRandom(RandomLoadingMessage)).setColor('#FF0000')] });
	}

	public pickRandom<T>(array: readonly T[]): T {
		const { length } = array;
		return array[Math.floor(Math.random() * length)];
	}
}
