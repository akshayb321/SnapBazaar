import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectDB = async ()=>{
    try { 
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database is connected succesfully!.");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;

