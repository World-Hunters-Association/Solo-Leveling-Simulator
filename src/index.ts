import './lib/env-setup';

import { ShardingManager } from 'discord.js';
import { join } from 'path';

const manager = new ShardingManager(join(__dirname, 'client.js'), {
	token: process.env.TOKEN!
});

manager.on('shardCreate', (shard) => console.log(`Launched shard ${shard.id}`));

void manager.spawn({ amount: 'auto', delay: 60000, timeout: -1 });
