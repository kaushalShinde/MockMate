
// const Redis = require('redis');
import Redis from 'redis';
// import Redis from "ioredis";


(async () => {
  const client = Redis.createClient({
    socket: {
      host: 'mockmate-rediscache-x8sr2y.serverless.aps1.cache.amazonaws.com',
      // host: '127.0.0.1',
      port: 6379,
      connectTimeout: 3000
    },
    // password: 'Kaushal*#008'
  });

  client.on('error', (err) => console.error('Redis Error:', err));
  client.on('ready', () => console.error('Redis Ready:'));

  await client.connect();
  const pong = await client.ping();
  console.log('Ping Response:', pong); // Should print PONG
  await client.quit();
})();



