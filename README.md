<div align="center">

<a href="https://www.sololevelingsimulator.tech" target="_blank"><img src="https://cdn.discordapp.com/attachments/712826938476986409/964427906216505364/Cover-Patreon.png"  width="100%" /></a>

# Solo Leveling Simulator

**An RPG Discord bot**

[![Support Server](https://discord.com/api/guilds/724186681124716544/embed.png?style=banner2)](https://discord.gg/bdC2UXz)

[![Patreon](https://img.shields.io/badge/Patreon-Donate-%23f96854?style=flat&logo=patreon)](https://www.patreon.com/sololevelingsimulator)
[![PayPal](https://img.shields.io/badge/PayPal-Donate-%2300457C?style=flat&logo=paypal&logoColor=white)](https://www.paypal.me/mzato0001)
[![Linktree](https://img.shields.io/badge/Linktree-Useful_links-%2339E09B?style=flat&logo=linktree)](https://www.paypal.me/mzato0001)

</div>

## Usage

Clone the repository and run the following command:

```
$ npm install
```

Install Sapphire CLI:

```
$ npm install -g @sapphire/cli
```

Create command/listener/precondition by Sapphire CLI:

```
$ sapphire generate command <command_name>
$ sapphire generate listener <listener_name>
$ sapphire generate precondition <precondition_name>
```

1. The CLI will create a file in the corresponding directory with the type of the command/listener/precondition.
2. Open the generated file and click on the last character.
3. `Ctrl + Space` to show the snippets.
4. `Enter` to use the snippet.

**You can change the command/listener/precondition name in the command to `<directoryName>/<command/listener/precondition_name>`**

Command structure code example:

```ts
import { ContextMenuCommandBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, Command, CommandOptions, RegisterBehavior } from '@sapphire/framework';

import type { CommandInteraction, ContextMenuInteraction } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'name',
	description: 'description',
	preconditions: ['Defer'],
	requiredClientPermissions: [BigInt(277025770560)],
	requiredUserPermissions: ['USE_EXTERNAL_EMOJIS']
})
export default class NameCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		// Register the slash command/context menu command
	}

	public async chatInputRun(interaction: CommandInteraction) {
		// Handle chat input command
	}

	public async contextMenuRun(interaction: ContextMenuInteraction) {
		// Handle context menu command
	}
}
```

Listener structure code example:

```ts
import { Listener } from '@sapphire/framework';

import type {} from 'discord.js';

export default class NameListener extends Listener {
	public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			name: 'Name'
		});
	}

	public async run() {}
}
```

Precondition structure code example:

```ts
import { PieceContext, Precondition } from '@sapphire/framework';

import type { CommandInteraction } from 'discord.js';

export default class NamePrecondition extends Precondition {
	public constructor(context: PieceContext, options: Precondition.Options) {
		super(context, {
			...options,
			name: 'Name'
		});
	}

	public async chatInputRun(interaction: CommandInteraction) {
		// Handle chat input command
	}

	public async contextMenuRun(interaction: CommandInteraction) {
		// Handle context menu command
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		Name: never;
	}
}
```
