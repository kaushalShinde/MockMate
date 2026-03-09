/*
// AWS Elasticache Implementation (cost)

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

*/


import Redis from "ioredis";

import dotenv from "dotenv";
dotenv.config({
    path: "./.env",
});


if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  retryStrategy(times) {
    return Math.min(times * 500, 2000);
  },
});

redis.on("connect", () => {
  console.log("Connected to Redis Cache");
});

redis.on("ready", () => {
  console.log("Redis Ready");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

export default redis;