import { cleanEnv, port, str } from "envalid";

const env = cleanEnv(process.env, {
    REDIS_URL: str(),
    NODE_ENV: str(),
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    WEBSITE_URL: str(),
    SERVER_URL: str(),
    SESSION_SECRET: str(),
    SMTP_PASSWORD: str(),
});

export default env;