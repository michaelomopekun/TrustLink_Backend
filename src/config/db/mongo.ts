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
        // Retry connection after 5 seconds
        console.log("Retrying MongoDB connection in 5 seconds...");
        setTimeout(dbConnect, 5000);
        dbConnect();
    }
}

// export default dbConnect;