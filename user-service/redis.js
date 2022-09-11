import Redis from 'ioredis';
import { RedisMemoryServer } from 'redis-memory-server';

const redisServer = new RedisMemoryServer();
const host = await redisServer.getHost();
const port = await redisServer.getPort();

const redis = new Redis(port, host); // 192.168.1.1:6379

// redis.on('error', (err) => console.log('Redis Client Error', err));

// await redis.connect();

export default redis;