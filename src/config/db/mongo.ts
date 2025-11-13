import mongoose from "mongoose";

export const dbConnect = async () => 
{
    try
    {
        const connection = await mongoose.connect(process.env.MONGOOSE_URI || "");

        console.log(`MongoDB connected: ${connection.connection.host}`);
    }
    catch (error: any)
    {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
}

// export default dbConnect;