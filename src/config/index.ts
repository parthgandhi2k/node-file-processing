import { config } from 'dotenv';
import { port, cleanEnv, str } from 'envalid';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const APP_CONFIG = cleanEnv(process.env, {
    // Server configuration
    PORT: port({
        devDefault: 5005,
        desc: "Port on which app should run"
    }),

    // Redis configuration
    REDIS_HOST: str({ desc: "Redis host string" }),
    REDIS_PORT: port({ desc: "Redis port" }),
    REDIS_PASSWORD: str({ desc: "Redis password" }),
});
