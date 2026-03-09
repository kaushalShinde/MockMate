


// const corsOption = {
//   origin: [
//     "http://localhost:3000", 
//     "http://mockm8.com", 
//     "https://www.mockm8.com", 
//     process.env.CLIENT_URL,
//   ],
//   credentials: true,
//   "methods": ["GET", "POST", "PUT", "DELETE"],
// };


const corsOption = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://mockm8.com",
      "https://www.mockm8.com",
      "https://mockmate-backend-m6i9.onrender.com",
      process.env.CLIENT_URL,
    ].filter(Boolean);;

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export { corsOption };