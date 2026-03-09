import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379, 
  tls: process.env.REDIS_TLS === "true" ? {} : undefined, // TLS connection if env variable is true
  retryStrategy(times) {
    return Math.min(times * 500, 2000);  // Retry strategy with exponential backoff
  },
});

// Event listeners for Redis
redis.on("connect", () => {
  console.log(`Connected to Redis at ${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`);
});

redis.on("ready", () => console.log("Redis Ready for commands"));

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});

export default redis;

