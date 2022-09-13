import { createClient } from "redis";
export const client = createClient();
const redisClient = async () => {
  try {
    await client.connect();
    console.log("connected to redis");
  } catch (e) {
    console.log("couldn't connect to redis");
  }
};

export default redisClient;
