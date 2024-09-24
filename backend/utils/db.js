import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI)
        await mongoose.connect("mongodb+srv://mydb:VIShal06@cluster0.s0urqtx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log('mongodb connected successfully.');
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;