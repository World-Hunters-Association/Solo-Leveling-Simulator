import type { SapphireClient } from '@sapphire/framework';
import type { APIMessage } from 'discord-api-types';
import {
	Snowflake,
	Collection,
	MessageEmbed,
	MessageActionRow,
	MessageButton,
	Message,
	BaseCommandInteraction,
	MessageComponentInteraction
} from 'discord.js';

import { RandomLoadingMessage } from './constants';

export default class Utils {
	public constructor(public client: SapphireClient) {}

	public HPMaxCalc(vit: number, level: number) {
		return Math.round(100 + level * 5 + vit * 3);
	}

	public MPMaxCalc(int: number, level: number) {
		return Math.round(100 + level * 5 + int * 0.5);
	}

	public ShowGuide(part: 'BigTurn' | 'SmallTurn1' | 'SmallTurn2' | 'SmallTurn3' | 'Party' | 'Profile' | 'Welcome', uid: Snowflake) {
		const pictures = new Collection(
			Object.entries({
				Welcome: 'https://media.discordapp.net/attachments/914004331525734410/919569139432038410/Welcome.png',
				Profile: 'https://media.discordapp.net/attachments/914004331525734410/914004396331917352/Profile.png',
				Party: 'https://media.discordapp.net/attachments/914004331525734410/914004396101206026/Party.png',
				BigTurn: 'https://media.discordapp.net/attachments/914004331525734410/914004395862151188/Bigturn.png',
				SmallTurn1: 'https://media.discordapp.net/attachments/914004331525734410/914004396566790275/SmallTurn1.png',
				SmallTurn2: 'https://media.discordapp.net/attachments/914004331525734410/914004396784885811/SmallTurn2.png',
				SmallTurn3: 'https://media.discordapp.net/attachments/914004331525734410/914004397019758662/SmallTurn3.png'
			})
		);

		const embed = new MessageEmbed().setColor('BLUE').setImage(pictures.get(part)!);

		enum PART {
			Welcome,
			Profile,
			Party,
			BigTurn,
			SmallTurn1,
			SmallTurn2,
			SmallTurn3
		}

		const components = [
			new MessageActionRow().setComponents([
				new MessageButton()
					.setLabel('Previous')
					.setStyle('SECONDARY')
					.setCustomId(`StartCommand:Guide:${uid}:Previous:${part === 'Welcome' ? 'SmallTurn3' : PART[PART[part] - 1]}`),
				new MessageButton()
					.setLabel('Next')
					.setStyle('SECONDARY')
					.setCustomId(`StartCommand:Guide:${uid}:Next:${part === 'SmallTurn3' ? 'Welcome' : PART[PART[part] + 1]}`)
			])
		];

		return { embeds: [embed], components };
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
