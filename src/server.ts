import { createServer } from 'http';

import { APP_CONFIG } from './config/index';
import app from './app/app';

const server = createServer(app);

const port = APP_CONFIG.PORT;

server.listen(port, () => console.log(`Server running on port ${port}`));
