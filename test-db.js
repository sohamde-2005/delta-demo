
require("dotenv").config();

const mongoose = require("mongoose");

async function testConnection() {
    try {
        await mongoose.connect(process.env.ATLASDB_URL, {
            serverSelectionTimeoutMS: 20000
        });

        console.log("Successfully connected to MongoDB Atlas!");

        await mongoose.disconnect();
        console.log("Connection closed successfully.");

    } catch (err) {
        console.log("Connection failed!");
        console.error(err);
    }
}

testConnection();
