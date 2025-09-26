import mongoose from "mongoose";

const connectDb = async () => {
    try {
        mongoose.connection.on("connected", () =>
            console.log("Database Connected Successfully")
        );

        await mongoose.connect(`${process.env.MONGO_URL}`);
    } catch (error) {
        console.error(" MongoDB connection error:", error.message);
    }
};

export default connectDb;
