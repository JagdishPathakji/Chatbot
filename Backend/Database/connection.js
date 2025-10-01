import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose"

async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
}

export default main
