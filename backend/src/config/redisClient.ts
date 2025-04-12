import { createClient } from "redis";
import env from "../env";

const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    reconnectStrategy: retries => Math.min(retries * 50, 2000),
  }
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

redisClient.connect().catch((err) => {
  console.error("❌ Could not connect to Redis:", err);
});

export default redisClient;

//const redisClient = createClient();
//redisClient.connect().catch(console.error);

//export default redisClient;


