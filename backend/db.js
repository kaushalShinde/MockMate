
import mongoose from "mongoose";

const connectDB = async(uri) => {
    try{
        const connect = await mongoose.connect(uri, {dbName: "mockmate"});
        console.log(`Connected to MongoDb ${connect.connection.host}`);
    }
    catch(error){
        console.log(`Error Connecting MongoDB \n ${error}`)
    }
}

export default connectDB;