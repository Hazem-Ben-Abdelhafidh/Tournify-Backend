import { createClient } from "redis";
const redisClient = async () => {
  try {
    const client = createClient();
    await client.connect();
    console.log("connected to redis");
  } catch (e) {
    console.log("couldn't connect to redis");
  }
};

export default redisClient;
