
// import mongoose from "mongoose";

// const connectDB = async(uri) => {
//     try{
//         const connect = await mongoose.connect(uri, {dbName: "mockmate"});
//         console.log(`Connected to MongoDb ${connect.connection.host}`);
//     }
//     catch(error){
//         console.log(`Error Connecting MongoDB \n ${error}`)
//     }
// }

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async (uri) => {
  try {
    const connection = await mongoose.connect(uri, {
      dbName: "mockmate",
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;