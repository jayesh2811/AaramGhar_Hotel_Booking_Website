const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://compass-user:vEPSLkRzd3ccVNv3@cluster0.n0u8kho.mongodb.net/mern-rooms";

mongoose.connect(mongoURL);

const connection = mongoose.connection;

connection.on("error", () => {
    console.log("Mongodb failed");
});

connection.on("connected", () => {
    console.log("Mongodb connection successfull");
});

module.exports = mongoose;
