


const corsOption = {
  origin: [
    "http://localhost:3000",
    // process.env.CLIENT_URL,
  ],
  credentials: true,
  "methods": ["GET, POST, PUT, DELETE"],
};

export { corsOption };