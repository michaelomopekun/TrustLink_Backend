import express from "express";
import { dbConnect } from "./src/config/db/mongo";
import dotenv from "dotenv";
import { swaggerDocs } from "./src/config/swagger";
import cors from 'cors';
import { verifyToken } from "./src/middleware/jwt";
import routes from "./src/routes";
// import helmet from 'helmet';
// import { start } from "repl";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

swaggerDocs(app, Number(process.env.PORT) || 5001);

app.use("/api", routes);

// app.use("/api/verification-session", router);

app.get("/healthcheck", (req, res) => {
    console.log("TrustLink Backend is up and running😏");
  res.status(200).send("TrustLink Backend is up and running😏");
})


app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Access granted", user: req.user });
});


const PORT = process.env.PORT || 5001;
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
        console.log(`🚀Server is running on http://localhost:${PORT}/apis`);
    });
}


startServer();