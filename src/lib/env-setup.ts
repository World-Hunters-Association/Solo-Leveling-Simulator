// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import { config } from 'dotenv-cra';
import { join } from 'path';

// Read env var
config({ path: join(join(join(__dirname, '..', '..'), 'src'), '.env') });
