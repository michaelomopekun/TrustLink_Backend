import express from "express";
import { dbConnect } from "./src/config/db/mongo";
import dotenv from "dotenv";
import { swaggerDocs } from "./src/config/swagger";
// import { start } from "repl";

dotenv.config();

const app = express();


swaggerDocs(app, Number(process.env.PORT) || 5000);



app.get("/healthcheck", (req, res) => {
  res.status(200).send("TrustLink Backend is up and running😏");
})

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGOOSE_URI || "";
console.log("⌚"+MONGO_URI);

if(!MONGO_URI)
{
    console.error("❌MONGO_URI is not defined in environment variables");
    process.exit(1);
}

const startServer = async () =>
{
    await dbConnect();

    app.listen(PORT, () => {
        console.log(`🚀Server is running on http://localhost:${PORT}`);
    });
}

startServer();