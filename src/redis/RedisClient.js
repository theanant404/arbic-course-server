import {createClient} from 'redis';
import dotenv from 'dotenv';
dotenv.config({
    path: './.env',
});


const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        
    }});

redisClient.on("error", (err) => console.error("Redis Error:", err));

(async () => {
  await redisClient.connect();
  console.log("Connected to Redis");
})();

export default redisClient;

