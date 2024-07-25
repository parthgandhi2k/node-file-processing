import Arena from 'bull-arena';
import Bull from 'bull';
import { APP_CONFIG } from '.';

export const ARENA_CONFIG = Arena(
  {
    Bull,
    queues: [
      {
        type: 'bull',
        name: 'Invoice-Process-Queue',
        hostId: 'Queue Server 1',
        redis: {
          password: APP_CONFIG.REDIS_PASSWORD,
          host: APP_CONFIG.REDIS_HOST,
          port: APP_CONFIG.REDIS_PORT,
        },
      }
    ],
  },
  {
    basePath: '/api/arena',
    disableListen: true,
  }
);
