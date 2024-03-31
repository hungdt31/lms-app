import mongoose from "mongoose";

 
const connection = async () => {
    try {
        const url : any = process.env.DATABASE_URL
        await mongoose.connect(url);
        console.log("Connected to database with mongoose successfully !");
    } catch (error) {
        console.log(error, "could not connect database.");
    }
};
export default connection
